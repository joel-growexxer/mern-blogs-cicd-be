import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  author: string;
  tags: string[];
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Essential indexes for query optimization
blogSchema.index({ title: 'text', content: 'text' }); // For text search queries
blogSchema.index({ createdAt: -1 }); // For blogs sorted by date (most common query)
blogSchema.index({ category: 1 }); // For category-based queries

// Virtual for reading time (estimated)
blogSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
});

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
