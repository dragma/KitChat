import log from './logger';

const hasAccess = (rule, user, rules) => {
  const { role } = user;
  if (!rules.whitelist && !rules.rules) {
    log('[INFO] no rules given. Granted all access to all users.');
    return true;
  }
  if (!rules.whitelist) {
    if (!role) {
      log('[WARNING] user has no role. On blacklist mode, user has all rights');
      return true;
    }
    if (!rules.rules[role]) {
      log('[WARNING] role', role, 'was not defined. On blacklist mode, all access granted.');
    } else if (rules.rules[role].indexOf(rule) !== -1) {
      log('[INFO] rule', rule, 'not granted for user', user._id);
      return false;
    }
    return true;
  }

  if (!role) {
    log('[WARNING] user has no role. On whitelist mode, user has no rights');
    return false;
  }
  if (!rules.rules[role]) {
    log('[WARNING] role', role, 'was not defined. On whitelist mode, no access granted.');
  } else if (rules.rules[role].indexOf(rule) !== -1) {
    return true;
  }
  log('[INFO] rule', rule, 'not granted for user', user._id);
  return false;
};


export default hasAccess;
