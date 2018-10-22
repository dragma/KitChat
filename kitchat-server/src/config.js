export const KITCHAT_DB_NAME = process.env.KITCHAT_DB_NAME || 'kitchat';
export const MONGO_HOST = process.env.MONGO_HOST || 'mongodb://localhost';
export const MONGO_URI = `${MONGO_HOST}/${KITCHAT_DB_NAME}`;
export const JWT_SECRET = process.env.JWT_SECRET || 'shhhh';
export const MAX_MESSAGE_SIZE = process.env.MAX_MESSAGE_SIZE || 3000;
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
