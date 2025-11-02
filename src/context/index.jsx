import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { db } from "../utils/dbConfig"; // Adjust the path to your dbConfig
import { Users, Records } from "../utils/schema"; // Adjust the path to your schema definitions
import { eq } from "drizzle-orm";
import { usePrivy } from "@privy-io/react-auth";

// Create a context
const StateContext = createContext();

// Provider component
export const StateContextProvider = ({ children }) => {
  const { user, authenticated, ready, login, logout } = usePrivy();
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Function to fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const result = await db.select().from(Users).execute();
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // Function to fetch user details by email
  const fetchUserByEmail = useCallback(async (email) => {
    try {
      setLoadingUser(true);
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.createdBy, email))
        .execute();
      if (result.length > 0) {
        setCurrentUser(result[0]);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
      setCurrentUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Auto-fetch current user when authenticated
  useEffect(() => {
    if (authenticated && user?.email?.address && !loadingUser) {
      fetchUserByEmail(user.email.address);
    }
  }, [authenticated, user?.email?.address, fetchUserByEmail, loadingUser]);

  // Function to create a new user
  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await db
        .insert(Users)
        .values(userData)
        .returning()
        .execute();
      setUsers((prevUsers) => [...prevUsers, newUser[0]]);
      // Set currentUser immediately after creation
      setCurrentUser(newUser[0]);
      return newUser[0];
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }, []);

  // Function to fetch all records for a specific user
  const fetchUserRecords = useCallback(async (userEmail) => {
    try {
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.createdBy, userEmail))
        .execute();
      setRecords(result);
    } catch (error) {
      console.error("Error fetching user records:", error);
    }
  }, []);

  // Function to create a new record
  const createRecord = useCallback(async (recordData) => {
    try {
      const newRecord = await db
        .insert(Records)
        .values(recordData)
        .returning({ id: Records.id })
        .execute();
      setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
      return newRecord[0];
    } catch (error) {
      console.error("Error creating record:", error);
      return null;
    }
  }, []);

  const updateRecord = useCallback(async (recordData, skipStateUpdate = false) => {
    try {
      const { documentID, ...dataToUpdate } = recordData;
      const updatedRecords = await db
        .update(Records)
        .set(dataToUpdate)
        .where(eq(Records.id, documentID))
        .returning()
        .execute();
      
      // Only update local state if not skipped (avoid unnecessary re-renders during batch updates)
      if (!skipStateUpdate) {
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === documentID ? { ...record, ...dataToUpdate } : record
          )
        );
      }
      
      return updatedRecords[0];
    } catch (error) {
      console.error("Error updating record:", error);
      return null;
    }
  }, []);

  // Function to fetch a single record by ID
  const fetchRecordById = useCallback(async (recordId) => {
    try {
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.id, recordId))
        .execute();
      return result[0] || null;
    } catch (error) {
      console.error("Error fetching record by ID:", error);
      return null;
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        user,
        authenticated,
        ready,
        login,
        logout,
        users,
        records,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecord,
        currentUser,
        loadingUser,
        updateRecord,
        fetchRecordById,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the context
export const useStateContext = () => useContext(StateContext);
