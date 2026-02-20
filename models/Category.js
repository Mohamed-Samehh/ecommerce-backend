const mongoose = require('mongoose');

// schema , options
const categorySchema = new mongoose.Schema({ // def schema fields
  name: {
    type: String,
    required: true,
    unique: true, // check in index
    trim: true // make data clean (modifier not validator)
  }
}, {
  timestamps: true // benefit for tracking (admin) and filtering
});

// create model, export it

const Category = mongoose.model('Category', categorySchema); // factoryname = factorybuilder(name of collections in db => (categories) named by mongodb , schema(rules factory to work with))

module.exports = Category; // export the factory
