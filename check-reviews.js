const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });
const Review = require('./models/review');

async function checkReviews() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const bookId = '699cd37794ea975c35278633'; // I, Robot
        const reviews = await Review.find({ bookId: new mongoose.Types.ObjectId(bookId) });
        console.log(`Found ${reviews.length} reviews for book ${bookId}`);
        console.log(JSON.stringify(reviews, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkReviews();
