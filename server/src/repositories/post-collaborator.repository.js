import { prisma } from "../config/prisma.js";

export const findPostById = (postId) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },

    include: {
      collaborators: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              role: true,
            },
          },
        },
      },
    },
  });
};

export const findUserById = (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      username: true,
      fullName: true,
      role: true,
    },
  });
};

export const findCollaborator = (postId, userId) => {
  return prisma.postCollaborator.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
        },
      },
    },
  });
};

export const createCollaborator = (postId, userId) => {
  return prisma.postCollaborator.create({
    data: {
      postId,
      userId,
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
        },
      },
    },
  });
};

export const acceptCollaboratorInvitation = (postId, userId) => {
  return prisma.postCollaborator.update({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },

    data: {
      acceptedAt: new Date(),
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
        },
      },
    },
  });
};

export const removeCollaborator = (postId, userId) => {
  return prisma.postCollaborator.delete({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });
};

export const getCollaborators = (postId) => {
  return prisma.postCollaborator.findMany({
    where: {
      postId,
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
        },
      },
    },

    orderBy: {
      invitedAt: "asc",
    },
  });
};
