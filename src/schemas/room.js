import mongoose, { Schema } from 'mongoose';

const RoomSchema = new Schema({
  created_at: { type: Date, required: true, default: Date.now },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', index: true }],
});


// export Room
const Room = mongoose.model('Room', RoomSchema);

Room.on('index', (err) => {
  if (err) {
    return console.warn('Warn error : Room event index', err);
  }
  return console.log('[INFO] Room fully indexed');
});

export default Room;
