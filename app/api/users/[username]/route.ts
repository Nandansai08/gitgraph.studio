import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            designs: true,
            likes: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Retrieve all designs belonging to this user that are PUBLIC
    const publicDesigns = await prisma.design.findMany({
      where: {
        creatorId: user.id,
        visibility: "PUBLIC",
      },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            likes: true,
            forks: true,
            comments: true,
            views: true,
          },
        },
      },
    });

    // Format designs list
    const designs = publicDesigns.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      graphData: d.graphData,
      previewImage: d.previewImage,
      likes: d._count.likes,
      forks: d._count.forks,
      comments: d._count.comments,
      views: d._count.views,
    }));

    // Calculate aggregated commit counts / statistics
    let totalViews = 0;
    let totalLikes = 0;
    let totalForks = 0;

    for (const design of publicDesigns) {
      totalViews += design._count.views;
      totalLikes += design._count.likes;
      totalForks += design._count.forks;
    }

    return NextResponse.json({
      profile: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.image,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      stats: {
        totalDesigns: user._count.designs,
        publicDesignsCount: publicDesigns.length,
        totalLikesReceived: totalLikes,
        totalViewsReceived: totalViews,
        totalForksReceived: totalForks,
      },
      designs,
    });
  } catch (error) {
    console.error("Failed to retrieve user profile data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
