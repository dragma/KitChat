export const APP_PORT = process.env.APP_PORT || '8080';
export const KITCHAT_DB_NAME = process.env.KITCHAT_DB_NAME || 'kitchat';
export const MONGO_HOST = process.env.MONGO_HOST || 'mongodb://localhost';
export const MONGO_URI = `${MONGO_HOST}/${KITCHAT_DB_NAME}`;
export const JWT_SECRET = process.env.JWT_SECRET || 'shhhh';
