let loginCount = 0
module.exports = {
  incrementLogin: () => loginCount++,
  getLoginCount: () => loginCount,
};
