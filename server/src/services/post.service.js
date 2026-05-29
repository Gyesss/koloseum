import * as postRepo from "../repositories/post.repository.js";
import * as eventRepo from "../repositories/event.repository.js";

export const createPost = async (eventId, user, data) => {
  const event = await eventRepo.findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (
    data.startAt &&
    data.endAt &&
    new Date(data.startAt) >= new Date(data.endAt)
  ) {
    throw new Error("startAt must be earlier than endAt");
  }

  if (user.role !== "ADMIN" && data.isFeatured === true) {
    throw new Error("Only admin can create featured posts");
  }

  const post = await postRepo.createPost(eventId, user.id, data);

  return post;
};

export const getPostsByEventId = async (eventId, userId) => {
  const event = await eventRepo.findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const posts = await postRepo.findPostsByEventId(eventId, userId);

  return posts;
};

export const getPostById = async (eventId, postId, userId) => {
  const post = await postRepo.findPostById(postId, userId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.eventId !== eventId) {
    throw new Error("Post does not belong to this event");
  }

  return post;
};

export const updatePost = async (eventId, postId, user, data) => {
  const existing = await postRepo.findPostById(postId);

  if (!existing) {
    throw new Error("Post not found");
  }

  if (existing.eventId !== eventId) {
    throw new Error("Post does not belong to this event");
  }

  const isOwner = existing.collaborators.some(
    (collaborator) => collaborator.userId === user.id && collaborator.isOwner,
  );

  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("You are not allowed to modify this post");
  }

  const nextStartAt = data.startAt || existing.startAt;
  const nextEndAt = data.endAt || existing.endAt;

  if (
    nextStartAt &&
    nextEndAt &&
    new Date(nextStartAt) >= new Date(nextEndAt)
  ) {
    throw new Error("startAt must be earlier than endAt");
  }

  if (user.role !== "ADMIN" && data.isFeatured === true) {
    throw new Error("Only admin can feature posts");
  }

  const updated = await postRepo.updatePostById(postId, data);

  return updated;
};

export const deletePost = async (eventId, postId, user) => {
  const existing = await postRepo.findPostById(postId);

  if (!existing) {
    throw new Error("Post not found");
  }

  if (existing.eventId !== eventId) {
    throw new Error("Post does not belong to this event");
  }

  const isOwner = existing.collaborators.some(
    (collaborator) => collaborator.userId === user.id && collaborator.isOwner,
  );

  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("You are not allowed to delete this post");
  }

  await postRepo.deletePostById(postId);

  return true;
};
