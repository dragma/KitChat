import log from './logger';

const eventLogger = (name, action) => (data) => {
  log('[EVENT] on', name);
  return action(data);
};

export default eventLogger;
