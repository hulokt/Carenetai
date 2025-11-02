export default {
  dialect: "postgresql",
  schema: "./src/utils/schema.jsx",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_H1D9hdnQpTUK@ep-winter-boat-aha3f8ct-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    connectionString:
      "postgresql://neondb_owner:npg_H1D9hdnQpTUK@ep-winter-boat-aha3f8ct-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
};
