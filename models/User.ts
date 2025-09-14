import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'user' | 'admin';
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be either user or admin'
    },
    default: 'user'
  },
  refreshToken: {
    type: String,
    required: false,
    select: false // Don't include in queries by default
  },
  refreshTokenExpiresAt: {
    type: Date,
    required: false,
    select: false // Don't include in queries by default
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      const { password, refreshToken, refreshTokenExpiresAt, ...userWithoutSensitiveData } = ret;
      return userWithoutSensitiveData;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      const { password, refreshToken, refreshTokenExpiresAt, ...userWithoutSensitiveData } = ret;
      return userWithoutSensitiveData;
    }
  }
});

// Index for efficient email lookups
userSchema.index({ email: 1 });

// Index for refresh token lookups
userSchema.index({ refreshToken: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
