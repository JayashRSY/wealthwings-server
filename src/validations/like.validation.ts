import Joi from 'joi';

const toggleLike = {
  body: Joi.object().keys({
    entityType: Joi.string().required().valid('blog', 'comment'),
    entityId: Joi.string().required().hex().length(24),
  })
};

const getUserLikeStatus = {
  query: Joi.object().keys({
    entityType: Joi.string().required().valid('blog', 'comment'),
    entityId: Joi.string().required().hex().length(24),
  })
};

export default {
  toggleLike,
  getUserLikeStatus
};