import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  created_at: { type: Date, required: true, default: Date.now },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  message: String,
});


// export Message
const Message = mongoose.model('Message', MessageSchema);

Message.on('index', (err) => {
  if (err) {
    return console.warn('Warn error : Message event index', err);
  }
  return console.log('[INFO] Message fully indexed');
});

export default Message;
