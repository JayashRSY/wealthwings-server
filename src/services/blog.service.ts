import Blog, { IBlog } from '../models/blog.model';
import { UserPayload } from '../types/custom';
import mongoose from 'mongoose';
import slugify from 'slugify';

export const createBlog = async (blogData: Partial<IBlog>, user: UserPayload): Promise<IBlog> => {
  // Generate slug from title
  const slug = slugify(blogData.title || '', { lower: true, strict: true });
  
  // Check if slug already exists
  const slugExists = await Blog.exists({ slug });
  const finalSlug = slugExists ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
  
  const blog = new Blog({
    ...blogData,
    slug: finalSlug,
    authorId: user.sub,
  });
  
  return await blog.save();
};

export const getBlogs = async (query: {
  page?: number;
  limit?: number;
  tag?: string;
  status?: 'draft' | 'published';
}) => {
  const { page = 1, limit = 10, tag, status = 'published' } = query;
  const skip = (page - 1) * limit;

  const filter: any = { status };
  if (tag) {
    filter.tags = tag;
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter)
  ]);

  return {
    blogs,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getBlogById = async (id: string): Promise<IBlog | null> => {
    console.log(id, "=========////", await Blog.findById(id)
    .populate('authorId', 'name email')
    .lean());
    
  return await Blog.findById(id)
    .populate('authorId', 'name email')
    .lean();
};

export const updateBlog = async (
  id: string,
  updateData: Partial<IBlog>,
  user: UserPayload
): Promise<IBlog | null> => {
  // If title is being updated, update slug as well
  if (updateData.title) {
    const slug = slugify(updateData.title, { lower: true, strict: true });
    const slugExists = await Blog.exists({ slug, _id: { $ne: id } });
    updateData.slug = slugExists ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
  }
  
  return await Blog.findOneAndUpdate(
    { _id: id, authorId: user.sub },
    updateData,
    { new: true, runValidators: true }
  ).lean();
};

export const deleteBlog = async (id: string, user: UserPayload): Promise<IBlog | null> => {
  return await Blog.findOneAndDelete({ _id: id, authorId: user.sub }).lean();
};

export const getBlogsByUser = async (
  user: UserPayload,
  query: {
    page?: number;
    limit?: number;
    status?: 'draft' | 'published';
  }
) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;

  const filter: any = { authorId: user.sub };
  if (status) {
    filter.status = status;
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter)
  ]);

  return {
    blogs,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const toggleBlogStatus = async (
  id: string,
  status: 'draft' | 'published',
  user: UserPayload
): Promise<IBlog | null> => {
  return await Blog.findOneAndUpdate(
    { _id: id, authorId: user.sub },
    { status },
    { new: true }
  ).lean();
};

export const getBlogBySlug = async (slug: string): Promise<IBlog | null> => {
  return await Blog.findOne({ slug, status: 'published' })
    .populate('authorId', 'name email')
    .lean();
};