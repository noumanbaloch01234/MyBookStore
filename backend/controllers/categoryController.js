import Category from '../models/categoryModel.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create category
export const createCategory = async (req, res) => {
  try {
    const { text, path, image, bgColor } = req.body;
    
    const category = await Category.create({
      text,
      path,
      image,
      bgColor
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};