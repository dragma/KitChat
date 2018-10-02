import mongoose from 'mongoose';
import bluebird from 'bluebird';

import { MONGO_URI } from './config';

mongoose.Promise = bluebird;
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('[INFO] Connected to Mongo'));
