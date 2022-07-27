const dotenv = require('dotenv');
// specifying our config file before requiring app file
dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
