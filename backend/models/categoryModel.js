import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true
  },
  path: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    default: '#FFFFFF'
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;