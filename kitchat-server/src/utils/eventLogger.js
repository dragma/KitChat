const logger = (name, action) => (data) => {
  console.log('[EVENT] on', name);
  return action(data);
};

export default logger;
