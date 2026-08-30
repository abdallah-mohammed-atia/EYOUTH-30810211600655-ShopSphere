require('dotenv').config();
console.log('review-service JWT_SECRET length:', process.env.JWT_SECRET?.length, 'first8:', process.env.JWT_SECRET?.slice(0,8), 'last8:', process.env.JWT_SECRET?.slice(-8));
const app = require('./app');

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`review-service listening on port ${PORT}`);
});
