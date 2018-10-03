import decode from '../utils/decode';
import User from '../data/user';

const auth = async (socket, next) => {
  if (socket.handshake && socket.handshake.query && socket.handshake.query.access_token) {
    const token = socket.handshake.query.access_token;
    try {
      const data = await decode(token);
      let user = null;
      if (data.kitchat_user_id) {
        user = await User.getById(data.kitchat_user_id);
      } else if (data.user_id) {
        user = await User.getBySecondaryId(data.user_id);
      }
      if (!user) {
        const userData = {};
        if (data.user_id) {
          userData.secondary_id = data.user_id;
        }
        user = await User.create(userData);
        socket.emit('created', { kitchat_user_id: user._id });
      }
      if (user) {
        socket.user = {
          ...user,
        };
      }
    } catch (err) {
      console.warn('[ERROR] Error during auth :', err.message);
    }
  }

  next();
};

export default auth;
