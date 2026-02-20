const mongoose = require('mongoose');

// schema , options
const categorySchema = new mongoose.Schema({ // def schema fields
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true, // check in index
    trim: true, // make data clean (modifier not validator)
    minLength: [4, 'Category name must be at least 4 characters'], // more enhancements
    maxLength: [50, 'Category name cannot exceed 50 characters']
  }
}, {
  timestamps: true // benefit for tracking (admin) and filtering
});

// create model, export it

const Category = mongoose.model('Category', categorySchema); // factoryname = factorybuilder(name of collections in db => (categories) named by mongodb , schema(rules factory to work with))

module.exports = Category; // export the factory
