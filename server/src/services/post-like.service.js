import * as repo from "../repositories/post-like.repository.js";

const ensurePostExists = async (postId) => {
  const post = await repo.findPostById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

export const likePost = async (postId, user) => {
  await ensurePostExists(postId);

  const existingLike = await repo.findPostLike(postId, user.id);

  if (existingLike) {
    throw new Error("Post already liked");
  }

  const like = await repo.createPostLike(postId, user.id);

  return like;
};

export const unlikePost = async (postId, user) => {
  await ensurePostExists(postId);

  const existingLike = await repo.findPostLike(postId, user.id);

  if (!existingLike) {
    throw new Error("Post has not been liked");
  }

  await repo.deletePostLike(postId, user.id);

  return true;
};
