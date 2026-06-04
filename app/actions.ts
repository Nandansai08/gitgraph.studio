"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod Validation Schemas
const DesignSaveSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional().nullable(),
  graphData: z.record(z.any()), // JSON pixels mapping
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  visibility: z.enum(["PUBLIC", "DRAFT", "UNPUBLISHED"]).default("DRAFT"),
});

const CommentSchema = z.object({
  designId: z.string().min(1),
  text: z.string().min(1, "Comment text is required").max(1000),
  parentId: z.string().optional().nullable(),
});

// Helper to assert authentication
async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized. Please authorize your session first.");
  }
  return session.user;
}

/**
 * Save Design (Create or Update Draft)
 */
export async function saveDesignAction(formData: z.infer<typeof DesignSaveSchema>) {
  const user = await getAuthUser();
  const data = DesignSaveSchema.parse(formData);

  const parsedStartDate = data.startDate ? new Date(data.startDate) : null;
  const parsedEndDate = data.endDate ? new Date(data.endDate) : null;

  if (data.id) {
    // Verify ownership
    const existing = await prisma.design.findUnique({
      where: { id: data.id },
    });

    if (!existing) throw new Error("Design not found.");
    if (existing.creatorId !== user.id) throw new Error("Permission denied.");

    const updated = await prisma.design.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        graphData: data.graphData,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        visibility: data.visibility,
      },
    });

    // Create Design Version history entry
    await prisma.designVersion.create({
      data: {
        designId: updated.id,
        graphData: data.graphData,
      },
    });

    return updated;
  } else {
    // Create new
    const created = await prisma.design.create({
      data: {
        title: data.title,
        description: data.description,
        graphData: data.graphData,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        visibility: data.visibility,
        creatorId: user.id,
      },
    });

    await prisma.designVersion.create({
      data: {
        designId: created.id,
        graphData: data.graphData,
      },
    });

    return created;
  }
}

/**
 * Delete Design
 */
export async function deleteDesignAction(designId: string) {
  const user = await getAuthUser();

  const existing = await prisma.design.findUnique({
    where: { id: designId },
  });

  if (!existing) throw new Error("Design not found.");
  if (existing.creatorId !== user.id) throw new Error("Permission denied.");

  await prisma.design.delete({
    where: { id: designId },
  });

  return { success: true };
}

/**
 * Toggle Like Design
 */
export async function toggleLikeAction(designId: string) {
  const user = await getAuthUser();

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_designId: {
        userId: user.id,
        designId: designId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_designId: {
          userId: user.id,
          designId: designId,
        },
      },
    });
    return { liked: false };
  } else {
    await prisma.like.create({
      data: {
        userId: user.id,
        designId: designId,
      },
    });
    return { liked: true };
  }
}

/**
 * Toggle Bookmark Design
 */
export async function toggleBookmarkAction(designId: string) {
  const user = await getAuthUser();

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_designId: {
        userId: user.id,
        designId: designId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: {
        userId_designId: {
          userId: user.id,
          designId: designId,
        },
      },
    });
    return { bookmarked: false };
  } else {
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        designId: designId,
      },
    });
    return { bookmarked: true };
  }
}

/**
 * Comment Server Action
 */
export async function commentAction(formData: z.infer<typeof CommentSchema>) {
  const user = await getAuthUser();
  const data = CommentSchema.parse(formData);

  const comment = await prisma.comment.create({
    data: {
      text: data.text,
      userId: user.id,
      designId: data.designId,
      parentId: data.parentId,
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return comment;
}

/**
 * Fork / Remix Design
 */
export async function forkDesignAction(designId: string) {
  const user = await getAuthUser();

  const source = await prisma.design.findUnique({
    where: { id: designId },
    include: { tags: true },
  });

  if (!source) throw new Error("Source design not found.");

  // Create duplicate design referencing parent source
  const forked = await prisma.design.create({
    data: {
      title: `${source.title} Remix`,
      description: `Remixed from @${source.creatorId}. ${source.description || ""}`,
      graphData: source.graphData as any,
      startDate: source.startDate,
      endDate: source.endDate,
      visibility: "DRAFT", // Defaults to draft so user can customize
      creatorId: user.id,
      parentId: source.id,
    },
  });

  // Track Fork relation metadata
  await prisma.fork.create({
    data: {
      parentId: source.id,
      childId: forked.id,
      userId: user.id,
    },
  });

  // Copy tags
  if (source.tags.length > 0) {
    await prisma.designTag.createMany({
      data: source.tags.map((t) => ({
        designId: forked.id,
        tagId: t.tagId,
      })),
    });
  }

  return forked;
}

/**
 * Log Analytics View
 */
export async function logViewAction(designId: string, visitorId?: string) {
  try {
    await prisma.view.create({
      data: {
        designId,
        visitorId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to log view analytic:", error);
    return { success: false };
  }
}

/**
 * Update User Profile Details
 */
export async function updateUserProfileAction(data: { name?: string; bio?: string; image?: string }) {
  const user = await getAuthUser();

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      bio: data.bio,
      image: data.image,
    },
  });

  return updated;
}
