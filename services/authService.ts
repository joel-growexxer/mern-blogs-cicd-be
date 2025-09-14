import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { User, IUser } from '../models/User';
import { CacheService } from '../utils/cacheService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Partial<IUser>;
    token: string;
    refreshToken?: string;
  };
}

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
  };
}

const AuthCacheConfig = {
  ttl: 3600, // 1 hour
  prefix: 'auth:'
};


export class AuthService {
  private static generateToken(userId: string, email: string, role: string): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const expiryMinutes = parseInt(process.env.JWT_EXPIRY_MINUTES || '15'); // Default 15 minutes
    
    return jwt.sign(
      { 
        userId, 
        email, 
        role
      },
      secret,
      { expiresIn: `${expiryMinutes}m` }
    );
  }

  private static generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private static getRefreshTokenExpiry(): Date {
    const refreshTokenExpiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '7'); // Default 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + refreshTokenExpiryDays);
    return expiryDate;
  }

  private static sanitizeUser(user: IUser): Partial<IUser> {
    const { password, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }

  // User signup
  static async signup(signupData: SignupData): Promise<AuthResponse> {
    try {
      const { email, password, role = 'user' } = signupData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Create new user
      const newUser = new User({
        email,
        password,
        role
      });

      await newUser.save();

      // Generate tokens
      const token = this.generateToken(String(newUser._id), newUser.email, newUser.role);
      const refreshToken = this.generateRefreshToken();
      const refreshTokenExpiresAt = this.getRefreshTokenExpiry();

      // Save refresh token to database
      newUser.refreshToken = refreshToken;
      newUser.refreshTokenExpiresAt = refreshTokenExpiresAt;
      await newUser.save();

      // Cache user data
      const cacheKey = `user:${newUser._id}`;
      await CacheService.set(cacheKey, this.sanitizeUser(newUser), { ttl: AuthCacheConfig.ttl, prefix: AuthCacheConfig.prefix });

      return {
        success: true,
        message: 'User created successfully',
        data: {
          user: this.sanitizeUser(newUser),
          token,
          refreshToken
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Failed to create user. Please try again.'
      };
    }
  }

  // User login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate tokens
      const token = this.generateToken(String(user._id), user.email, user.role);
      const refreshToken = this.generateRefreshToken();
      const refreshTokenExpiresAt = this.getRefreshTokenExpiry();

      // Save refresh token to database
      user.refreshToken = refreshToken;
      user.refreshTokenExpiresAt = refreshTokenExpiresAt;
      await user.save();

      // Cache user data
      const cacheKey = `user:${user._id}`;
      await CacheService.set(cacheKey, this.sanitizeUser(user), { ttl: AuthCacheConfig.ttl, prefix: AuthCacheConfig.prefix });

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: this.sanitizeUser(user),
          token,
          refreshToken
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  // Get user by ID (with caching)
  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      const cacheKey = `user:${userId}`;
      
      return await CacheService.getOrSet(
        cacheKey,
        async () => {
          const user = await User.findById(userId);
          return user;
        },
        { ttl: AuthCacheConfig.ttl, prefix: AuthCacheConfig.prefix }
      );
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Verify JWT token
  static verifyToken(token: string): { userId: string; email: string; role: string } | null {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, secret) as any;
      
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      if (!refreshToken) {
        return {
          success: false,
          message: 'Refresh token is required'
        };
      }

      // Find user with valid refresh token
      const user = await User.findOne({ 
        refreshToken,
        refreshTokenExpiresAt: { $gt: new Date() }
      }).select('+refreshToken +refreshTokenExpiresAt');

      if (!user) {
        return {
          success: false,
          message: 'Invalid or expired refresh token'
        };
      }

      // Generate new tokens
      const newAccessToken = this.generateToken(String(user._id), user.email, user.role);
      const newRefreshToken = this.generateRefreshToken();
      const refreshTokenExpiresAt = this.getRefreshTokenExpiry();

      // Update refresh token in database
      user.refreshToken = newRefreshToken;
      user.refreshTokenExpiresAt = refreshTokenExpiresAt;
      await user.save();

      return {
        success: true,
        message: 'Tokens refreshed successfully',
        data: {
          token: newAccessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: 'Failed to refresh token'
      };
    }
  }

  // Logout (invalidate cache and refresh token)
  static async logout(userId: string, refreshToken?: string): Promise<boolean> {
    try {
      const cacheKey = `user:${userId}`;
      await CacheService.del(cacheKey, AuthCacheConfig.prefix);

      if (refreshToken) {
        // Remove refresh token from database
        await User.findByIdAndUpdate(userId, {
          $unset: { refreshToken: 1, refreshTokenExpiresAt: 1 }
        });
      }

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  // Get all users (admin only)
  static async getAllUsers(query: any = {}): Promise<{ users: IUser[], total: number, page: number, limit: number }> {
    try {
      const { 
        role, 
        search, 
        page = 1, 
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query;
      
      // Create cache key based on query parameters
      const cacheKey = `users:list:${JSON.stringify(query)}`;

      return await CacheService.getOrSet(
        cacheKey,
        async () => {
          let filter: any = {};
          
          // Role filter
          if (role) {
            filter.role = role;
          }
          
          // Search filter
          if (search) {
            filter.email = { $regex: search, $options: 'i' };
          }
          
          const skip = (parseInt(page) - 1) * parseInt(limit);
          const sortOptions: any = {};
          sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
          
          const [users, total] = await Promise.all([
            User.find(filter)
              .sort(sortOptions)
              .skip(skip)
              .limit(parseInt(limit)),
            User.countDocuments(filter)
          ]);
          
          return {
            users,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
          };
        },
        { ttl: AuthCacheConfig.ttl, prefix: AuthCacheConfig.prefix }
      );
    } catch (error) {
      console.error('Get all users error:', error);
      throw new Error('Failed to fetch users');
    }
  }
}
