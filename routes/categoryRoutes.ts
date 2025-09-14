import { Router, Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Category name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Category name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.deleteCategory(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    if (error.message === 'Cannot delete category that is being used by blogs') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category that is being used by blogs'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

export default router;
