import Joi from 'joi';

const createBlog = {
  body: Joi.object().keys({
    title: Joi.string().required().trim().min(5).max(200),
    content: Joi.string().required().min(50),
    tags: Joi.array().items(Joi.string().trim()).max(5),
    coverImage: Joi.string().uri().optional(),
    status: Joi.string().valid('draft', 'published').default('draft'),
  })
};

const updateBlog = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  }),
  body: Joi.object().keys({
    title: Joi.string().trim().min(5).max(200),
    content: Joi.string().min(50),
    tags: Joi.array().items(Joi.string().trim()).max(5),
    coverImage: Joi.string().uri().optional(),
  })
};

const getBlogById = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  })
};

const deleteBlog = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  })
};

const getBlogs = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    tag: Joi.string(),
    status: Joi.string().valid('draft', 'published')
  })
};

const getUserBlogs = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    status: Joi.string().valid('draft', 'published')
  })
};

const toggleBlogStatus = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  }),
  body: Joi.object().keys({
    status: Joi.string().required().valid('draft', 'published')
  })
};

const getBlogBySlug = {
  params: Joi.object().keys({
    slug: Joi.string().required().trim()
  })
};

export default {
  createBlog,
  updateBlog,
  getBlogById,
  deleteBlog,
  getBlogs,
  getUserBlogs,
  toggleBlogStatus,
  getBlogBySlug
};