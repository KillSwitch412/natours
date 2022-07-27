const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DBconnectionString = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DBconnectionString)
    .then(() => console.log('DB connection successful'));

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    price: { type: String, required: [true, 'A tour must have a price'] },
    rating: { type: Number, default: 4.5 },
});

const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//     name: 'The Park Camper',
//     price: 997,
// });

// testTour
//     .save()
//     .then((doc) => {
//         console.log(doc);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
