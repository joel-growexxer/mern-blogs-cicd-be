import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    const result = await AuthService.signup({ email, password, role });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Signup route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await AuthService.login({ email, password });

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await AuthService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Refresh token route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { refreshToken } = req.body;
    
    await AuthService.logout(userId, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await AuthService.getAllUsers(req.query);
    
    res.status(200).json({
      success: true,
      count: result.users.length,
      total: result.total,
      page: result.page,
      limit: result.limit,
      data: result.users
    });
  } catch (error) {
    console.error('Get users route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

export default router;
