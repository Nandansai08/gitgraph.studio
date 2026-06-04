import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const designId = searchParams.get("id");

    if (designId) {
      const design = await prisma.design.findUnique({
        where: { id: designId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
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

      if (!design) {
        return NextResponse.json({ error: "Design not found" }, { status: 404 });
      }

      if (design.visibility !== "PUBLIC" && (!session?.user?.id || design.creatorId !== session.user.id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return NextResponse.json({
        id: design.id,
        title: design.title,
        name: design.title,
        description: design.description,
        graphData: design.graphData,
        visibility: design.visibility,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
        creator: design.creator,
        likes: design._count.likes,
        forks: design._count.forks,
        comments: design._count.comments,
        views: design._count.views,
        tags: design.tags.map((t) => t.tag.name),
      });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const visibility = searchParams.get("visibility"); // e.g. "DRAFT", "PUBLIC"

    const whereClause: any = {
      creatorId: session.user.id,
    };

    if (visibility) {
      whereClause.visibility = visibility;
    }

    const designs = await prisma.design.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
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

    const formatted = designs.map((d) => ({
      id: d.id,
      name: d.title, // Maps title to UI "name"
      title: d.title,
      description: d.description,
      graphData: d.graphData,
      visibility: d.visibility,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      likes: d._count.likes,
      forks: d._count.forks,
      comments: d._count.comments,
      views: d._count.views,
      tags: d.tags.map((t) => t.tag.name),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to retrieve designs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, graphData, visibility, startDate, endDate, tags } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const design = await prisma.design.create({
      data: {
        title,
        description,
        graphData,
        visibility: visibility || "DRAFT",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        creatorId: session.user.id,
      },
    });

    // Create Tag bindings if provided
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });

        await prisma.designTag.upsert({
          where: {
            designId_tagId: {
              designId: design.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            designId: design.id,
            tagId: tag.id,
          },
        });
      }
    }

    // Save initial design version history record
    await prisma.designVersion.create({
      data: {
        designId: design.id,
        graphData: graphData,
      },
    });

    return NextResponse.json(design);
  } catch (error) {
    console.error("Failed to create design:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
