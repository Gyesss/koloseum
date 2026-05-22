import * as repo from "../repositories/post-collaborator.repository.js";

const ensurePostExists = async (postId) => {
  const post = await repo.findPostById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

const ensureOwnerOrAdmin = (post, user) => {
  const isAdmin = user.role === "ADMIN";

  const isOwner = post.collaborators.some(
    (collaborator) => collaborator.userId === user.id && collaborator.isOwner,
  );

  if (!isOwner && !isAdmin) {
    throw new Error("You are not allowed to manage collaborators");
  }
};

export const inviteCollaborator = async (postId, requester, data) => {
  const post = await ensurePostExists(postId);

  ensureOwnerOrAdmin(post, requester);

  if (data.userId === requester.id) {
    throw new Error("You cannot invite yourself");
  }

  const targetUser = await repo.findUserById(data.userId);

  if (!targetUser) {
    throw new Error("User not found");
  }

  if (targetUser.role !== "ADMIN" && targetUser.role !== "ORGANIZER") {
    throw new Error("Only organizer or admin can become collaborator");
  }

  const existingCollaborator = await repo.findCollaborator(postId, data.userId);

  if (existingCollaborator) {
    throw new Error("User is already a collaborator");
  }

  const collaborator = await repo.createCollaborator(postId, data.userId);

  return collaborator;
};

export const acceptInvitation = async (postId, user) => {
  const post = await ensurePostExists(postId);

  const collaborator = await repo.findCollaborator(post.id, user.id);

  if (!collaborator) {
    throw new Error("Invitation not found");
  }

  if (collaborator.acceptedAt) {
    throw new Error("Invitation already accepted");
  }

  const accepted = await repo.acceptCollaboratorInvitation(post.id, user.id);

  return accepted;
};

export const removeCollaborator = async (postId, targetUserId, requester) => {
  const post = await ensurePostExists(postId);

  ensureOwnerOrAdmin(post, requester);

  const collaborator = await repo.findCollaborator(post.id, targetUserId);

  if (!collaborator) {
    throw new Error("Collaborator not found");
  }

  if (collaborator.isOwner) {
    throw new Error("Owner cannot be removed");
  }

  await repo.removeCollaborator(post.id, targetUserId);

  return true;
};

export const getCollaborators = async (postId) => {
  await ensurePostExists(postId);

  return repo.getCollaborators(postId);
};
