import decode from '../utils/decode';

const auth = async (socket, next) => {
  if (socket.handshake && socket.handshake.query && socket.handshake.query.access_token) {
    const token = socket.handshake.query.access_token;
    try {
      const data = await decode(token);
      socket.user = {
        _id: data.user_id,
      };
    } catch (err) {
      console.warn('[ERROR] Error during access_token decode :', err.message);
    }
  }
  next();
};

export default auth;
