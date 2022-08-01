const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            minlength: [10, 'A tour name can must have atleast 10 characters.'],
            maxlength: [40, 'A tour name can only have maximum 40 characters.'],
        },
        slug: {
            type: String,
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty can be either easy, medium or hard',
            },
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be atleast 1.0'],
            max: [5, 'Rating cannot be more than 5.0'],
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // 'this' keyword here only points to current document when
                    // creating a NEW document.
                    // so this validator does'nt work when updating a doc
                    return val < this.price;
                },
                message: 'Discount should be less than the actual price ',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// virtual field: not persisted in DB
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs only before .save() and .create()
tourSchema.pre('save', function (next) {
    // adding a slug property to the document
    this.slug = slugify(this.name, { lower: true });
    next();
});

// QUERY MIDDLEWARE: runs before executing query starting with 'find' (ex: 'findOne', 'findById')
// --> removing secret tours before sending tours
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(
        `time taken for query execution: ${
            Date.now() - this.start
        } milliseconds`
    );
    next();
});

// AGGREGATION MIDDLEWARE:
// unshift() adds element at the beginning of the array, shift() adds at the end
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
