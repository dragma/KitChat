export const KITCHAT_DB_NAME = process.env.KITCHAT_DB_NAME || 'kitchat';
export const MONGO_HOST = process.env.MONGO_HOST || 'mongodb://localhost';
export const MONGO_URI = `${MONGO_HOST}/${KITCHAT_DB_NAME}`;
