import { Router, Request, Response } from 'express';
import { BlogService } from '../services/blogService';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Private
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await BlogService.getAllBlogs(req.query);
    
    res.status(200).json({
      success: true,
      count: result.blogs.length,
      total: result.total,
      page: result.page,
      limit: result.limit,
      data: result.blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Private
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const blog = await BlogService.getBlogById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const blog = await BlogService.createBlog(req.body);
    
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.message === 'Category not found') {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const blog = await BlogService.updateBlog(req.params.id, req.body);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.message === 'Category not found') {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const blog = await BlogService.deleteBlog(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

export default router;
