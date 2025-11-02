import React, { useState, useEffect } from "react";
import { IconCirclePlus } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../../context/index";
import CreateRecordModal from "./components/create-record-modal"; // Adjust the import path
import RecordCard from "./components/record-card"; // Adjust the import path

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = usePrivy();
  const {
    records,
    fetchUserRecords,
    createRecord,
    fetchUserByEmail,
    currentUser,
  } = useStateContext();
  const [userRecords, setUserRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserByEmail(user.email.address);
      fetchUserRecords(user.email.address);
    }
  }, [user, fetchUserByEmail, fetchUserRecords]);

  useEffect(() => {
    setUserRecords(records);
    localStorage.setItem("userRecords", JSON.stringify(records));
  }, [records]);

  // Open modal if navigated from sidebar with openModal state
  useEffect(() => {
    if (location.state?.openModal) {
      setIsModalOpen(true);
      // Clear the state to prevent reopening on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const createFolder = async (foldername) => {
    try {
      if (currentUser) {
        const newRecord = await createRecord({
          userId: currentUser.id,
          recordName: foldername,
          analysisResult: "",
          kanbanRecords: "",
          createdBy: user.email.address,
        });

        if (newRecord) {
          fetchUserRecords(user.email.address);
          handleCloseModal();
        }
      }
    } catch (e) {
      console.log(e);
      handleCloseModal();
    }
  };

  const handleNavigate = (name) => {
    const filteredRecords = userRecords.filter(
      (record) => record.recordName === name,
    );
    navigate(`/medical-records/${name}`, {
      state: filteredRecords[0],
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-jakarta mb-2">Medical Records</h2>
          <p className="text-gray-600">Manage and organize your healthcare documents</p>
        </div>
        
        <button
          type="button"
          className="btn-primary inline-flex items-center gap-x-2 whitespace-nowrap"
          onClick={handleOpenModal}
        >
          <IconCirclePlus size={20} />
          Create New Record
        </button>
      </div>

      <CreateRecordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={createFolder}
      />

      {/* Records Grid */}
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {userRecords?.length > 0 ? (
          userRecords.map((record, index) => (
            <div
              key={record.recordName}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.2 + index * 0.05}s` }}
            >
              <RecordCard
                record={record}
                onNavigate={handleNavigate}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <IconCirclePlus size={48} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-jakarta">No Records Yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first medical record</p>
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-x-2"
                onClick={handleOpenModal}
              >
                <IconCirclePlus size={20} />
                Create Your First Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
