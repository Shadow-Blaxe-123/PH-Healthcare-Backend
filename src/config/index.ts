import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  hash_salt: Number(process.env.SALT),
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  },
  jwt: {
    access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
    access_token_expire: process.env.JWT_ACCESS_TOKEN_EXPIRATION as string,
    refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
    refresh_token_expire: process.env.JWT_REFRESH_TOKEN_EXPIRATION as string,
  },
  openRouterApiKey: process.env.OPENROUTER_API_KEY as string,
};
