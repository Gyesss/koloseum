import { prisma } from "../config/prisma.js";

export const createPost = async (eventId, ownerId, data) => {
  return prisma.post.create({
    data: {
      title: data.title,
      caption: data.caption,
      postType: data.postType,
      isFeatured: data.isFeatured || false,
      startAt: data.startAt,
      endAt: data.endAt,

      event: {
        connect: {
          id: eventId,
        },
      },

      collaborators: {
        create: {
          userId: ownerId,
          isOwner: true,
        },
      },
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

      _count: {
        select: {
          postLikes: true,
          comments: true,
        },
      },
    },
  });
};

export const findPostsByEventId = async (eventId, userId) => {
  const posts = await prisma.post.findMany({
    where: {
      eventId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      media: {
        select: {
          url: true,
          name: true,
          mimeType: true,
          size: true,
        },
      },

      collaborators: {
        where: {
          isOwner: true,
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
      },

      postLikes: {
        select: {
          userId: true,
        },
      },

      _count: {
        select: {
          postLikes: true,
          comments: true,
        },
      },
    },
  });

  return posts.map(({ postLikes, ...post }) => ({
    ...post,

    isLiked: userId ? postLikes.some((like) => like.userId === userId) : false,
  }));
};

export const findPostById = async (id, userId) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },

    include: {
      media: {
        select: {
          url: true,
          name: true,
          mimeType: true,
          size: true,
        },
      },

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

      postLikes: {
        select: {
          userId: true,
        },
      },

      _count: {
        select: {
          postLikes: true,
          comments: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  const { postLikes, ...rest } = post;

  return {
    ...rest,

    isLiked: userId ? postLikes.some((like) => like.userId === userId) : false,
  };
};

export const updatePostById = (id, data) => {
  return prisma.post.update({
    where: {
      id,
    },

    data,

    include: {
      media: {
        select: {
          url: true,
          name: true,
          mimeType: true,
          size: true,
        },
      },

      collaborators: {
        where: {
          isOwner: true,
        },

        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      },

      _count: {
        select: {
          postLikes: true,
          comments: true,
        },
      },
    },
  });
};

export const deletePostById = async (id) => {
  return prisma.$transaction([
    prisma.postCollaborator.deleteMany({
      where: {
        postId: id,
      },
    }),

    prisma.post.delete({
      where: {
        id,
      },
    }),
  ]);
};
