import * as dotenv from 'dotenv';
dotenv.config();

export const projectConfig = {
  port: process.env.PORT,
  fe_url: process.env.FE_URL,
  mongoDbConnect: process.env.MONGO_DB_CONNECT,
  mongoDbDatabaseName: process.env.MONGO_DB_DATABASE_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  resendToken: process.env.RESEND_TOKEN,
};
