import jwt from 'jsonwebtoken';

const decode = (token, jwt_secret) => {
  try {
    return jwt.verify(token, jwt_secret);
  } catch (err) {
    throw err;
  }
};

export default decode;
