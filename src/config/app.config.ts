export default () => ({
  appSecret: process.env.APP_SECRET,
  saltRounds: process.env.SALT_ROUNDS,
  dbUrl: process.env.DB_URL,
});
