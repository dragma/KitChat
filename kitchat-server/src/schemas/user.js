import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  created_at: { type: Date, required: true, default: Date.now },
  secondary_id: { type: String, index: true },
  nickname: String,
  firstname: String,
  lastname: String,
  online: Boolean,
});


// fullname virtual
function getFullName() {
  return `${this.firstname} ${this.lastname}`;
}
UserSchema.virtual('full_name').get(getFullName);


// export User
const User = mongoose.model('User', UserSchema);

User.on('index', (err) => {
  if (err) {
    return console.warn('Warn error : User event index', err);
  }
  return console.log('[INFO] User fully indexed');
});

export default User;
