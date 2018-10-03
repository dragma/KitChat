import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

const decode = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw err;
  }
};

export default decode;
