import Joi from 'joi';

const createComment = {
  body: Joi.object().keys({
    blogId: Joi.string().required().hex().length(24),
    content: Joi.string().required().trim().min(1).max(1000),
    parentCommentId: Joi.string().hex().length(24).allow(null),
  })
};

const getCommentsByBlog = {
  params: Joi.object().keys({
    blogId: Joi.string().required().hex().length(24)
  }),
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  })
};

const updateComment = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  }),
  body: Joi.object().keys({
    content: Joi.string().required().trim().min(1).max(1000),
  })
};

const deleteComment = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  })
};

export default {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment
};