const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DBconnectionString = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DBconnectionString)
    .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`server started on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err.name}`);
    console.log(`MESSAGE: ${err.message}`);

    console.log('UNHANDLED REJECTION! --> Shutting Down...');

    // server.close(), gives the server time to finish the pending requests,
    // then calls the callback, which shuts down the application
    server.close(() => {
        process.exit(1);
    });
});
