const hasAccess = (rule, user, rules) => {
  const { role } = user;
  if (!rules.rulesType && !rules.rules) {
    console.log('[INFO] no roles given. Granted all access to all users.');
    return true;
  }
  if (!rules.rulesType || rules.rulesType === 'blacklist') {
    if (!role) {
      console.log('[WARNING] user has no role. On blacklist mode, user has all rights');
      return true;
    }
    if (!rules.rules[role]) {
      console.log('[WARNING] role', role, 'was not defined. On blacklist mode, all access granted.');
    } else if (rules.rules[role].indexOf(rule) !== -1) {
      console.log('[INFO] rule', rule, 'not granted for user', user._id);
      return false;
    }
    return true;
  } if (rules.rulesType === 'whitelist') {
    if (!role) {
      console.log('[WARNING] user has no role. On whitelist mode, user has no rights');
      return false;
    }
    if (!rules.rules[role]) {
      console.log('[WARNING] role', role, 'was not defined. On whitelist mode, no access granted.');
    } else if (rules.rules[role].indexOf(rule) !== -1) {
      return true;
    }
    console.log('[INFO] rule', rule, 'not granted for user', user._id);
    return false;
  }
  console.log('[WARNING] bad rulesType value : ', rules.rulesType);
  return false;
};


export default hasAccess;
