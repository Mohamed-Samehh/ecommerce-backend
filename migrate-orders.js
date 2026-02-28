const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });
const Order = require('./models/order');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await Order.updateMany(
            { status: 'out for delivery' },
            { $set: { status: 'shipped' } }
        );

        console.log(`Migration complete. Updated ${result.modifiedCount} orders.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
