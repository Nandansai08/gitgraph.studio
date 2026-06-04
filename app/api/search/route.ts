import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 12;
    const skip = (page - 1) * limit;

    if (!query) {
      return NextResponse.json({
        designs: [],
        pagination: { page, totalPages: 0, totalItems: 0 },
      });
    }

    // Fuzzy matching using case-insensitive contains filters across title, description, username, and tags
    const whereClause: any = {
      visibility: "PUBLIC",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        {
          creator: {
            username: { contains: query, mode: "insensitive" },
          },
        },
        {
          tags: {
            some: {
              tag: {
                name: { contains: query, mode: "insensitive" },
              },
            },
          },
        },
      ],
    };

    const [designs, totalCount] = await prisma.$transaction([
      prisma.design.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
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
      }),
      prisma.design.count({ where: whereClause }),
    ]);

    const formatted = designs.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      graphData: d.graphData,
      previewImage: d.previewImage,
      createdAt: d.createdAt,
      creator: d.creator,
      likes: d._count.likes,
      forks: d._count.forks,
      comments: d._count.comments,
      views: d._count.views,
      tags: d.tags.map((dt) => dt.tag.name),
    }));

    return NextResponse.json({
      designs: formatted,
      pagination: {
        page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    });
  } catch (error) {
    console.error("Search query failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
