import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRESET_DESIGNS = [
  // ─── Original 4 Pixel Art Presets ───────────────────────────────────────────
  {
    id: "preset-heart",
    title: "Pixel Love Heart",
    description: "A beautiful pixelated heart design positioned in the center of the contribution grid.",
    graphData: {
      "24_1": 3, "25_1": 3, "27_1": 3, "28_1": 3,
      "23_2": 4, "24_2": 4, "25_2": 4, "26_2": 4, "27_2": 4, "28_2": 4, "29_2": 4,
      "23_3": 4, "24_3": 4, "25_3": 4, "26_3": 4, "27_3": 4, "28_3": 4, "29_3": 4,
      "24_4": 3, "25_4": 3, "26_4": 3, "27_4": 3, "28_4": 3,
      "25_5": 2, "26_5": 2, "27_5": 2,
      "26_6": 1
    },
    tags: ["Art"],
    likes: 128, forks: 34, views: 1240,
  },
  {
    id: "preset-invader",
    title: "Space Invader",
    description: "Classic retro arcade 8-bit space invader contribution art.",
    graphData: {
      "23_1": 3, "29_1": 3,
      "24_2": 3, "28_2": 3,
      "23_3": 4, "24_3": 4, "25_3": 4, "26_3": 4, "27_3": 4, "28_3": 4, "29_3": 4,
      "22_4": 4, "23_4": 4, "25_4": 4, "26_4": 4, "27_4": 4, "29_4": 4, "30_4": 4,
      "21_5": 3, "22_5": 3, "23_5": 3, "24_5": 3, "25_5": 3, "26_5": 3, "27_5": 3, "28_5": 3, "29_5": 3, "30_5": 3, "31_5": 3,
      "23_6": 2, "29_6": 2
    },
    tags: ["Art"],
    likes: 85, forks: 19, views: 742,
  },
  {
    id: "preset-git",
    title: "Hello Git Logo",
    description: "Typographic letter art rendering 'GIT' in solid intensity levels.",
    graphData: {
      "20_1": 4, "21_1": 4, "22_1": 4,
      "19_2": 4, "19_3": 4, "19_4": 4,
      "20_5": 4, "21_5": 4, "22_5": 4,
      "22_3": 4, "22_4": 4, "21_3": 4,
      "25_1": 4, "25_2": 4, "25_3": 4, "25_4": 4, "25_5": 4,
      "28_1": 4, "29_1": 4, "30_1": 4,
      "29_2": 4, "29_3": 4, "29_4": 4, "29_5": 4
    },
    tags: ["Text"],
    likes: 154, forks: 52, views: 2012,
  },
  {
    id: "preset-logo",
    title: "GitGraph Emblem",
    description: "Abstract workflow contribution diamond vector grid representation.",
    graphData: {
      "26_1": 4, "27_1": 4, "28_1": 4,
      "25_2": 4, "29_2": 4,
      "24_3": 4, "27_3": 4, "30_3": 4,
      "25_4": 4, "29_4": 4,
      "26_5": 4, "27_5": 4, "28_5": 4
    },
    tags: ["Logos"],
    likes: 210, forks: 64, views: 3120,
  },

  // ─── Original Gallery Presets (converted from galleryData.ts) ───────────────
  {
    id: "preset-nebula",
    title: "Nebula Framework Flow",
    description: "A beautiful git representation structure shaped like an organic constellation wave representing dynamic branches and merge pipelines.",
    graphData: {
      "0_3":4,"0_2":3,"0_4":3,"0_1":1,"0_5":1,"1_4":4,"1_3":3,"1_5":3,"1_2":1,"1_6":1,
      "2_4":4,"2_3":3,"2_5":3,"2_2":1,"2_6":1,"3_5":4,"3_4":3,"3_6":3,"3_3":1,
      "4_5":4,"4_4":3,"4_6":3,"4_3":1,"5_5":4,"5_4":3,"5_6":3,"5_3":1,
      "6_5":4,"6_4":3,"6_6":3,"6_3":1,"7_5":4,"7_4":3,"7_6":3,"7_3":1,
      "8_5":4,"8_4":3,"8_6":3,"8_3":1,"9_4":4,"9_3":3,"9_5":3,"9_2":1,"9_6":1,
      "10_4":4,"10_3":3,"10_5":3,"10_2":1,"10_6":1,"11_3":4,"11_2":3,"11_4":3,"11_1":1,"11_5":1,
      "12_2":4,"12_1":3,"12_3":3,"12_0":1,"12_4":1,"13_2":4,"13_1":3,"13_3":3,"13_0":1,"13_4":1,
      "14_1":4,"14_0":3,"14_2":3,"14_3":1,"15_1":4,"15_0":3,"15_2":3,"15_3":1,
      "16_1":4,"16_0":3,"16_2":3,"16_3":1,"17_1":4,"17_0":3,"17_2":3,"17_3":1,
      "18_1":4,"18_0":3,"18_2":3,"18_3":1,"19_1":4,"19_0":3,"19_2":3,"19_3":1,
      "20_2":4,"20_1":3,"20_3":3,"20_0":1,"20_4":1,"21_2":4,"21_1":3,"21_3":3,"21_0":1,"21_4":1,
      "22_3":4,"22_2":3,"22_4":3,"22_1":1,"22_5":1,"23_4":4,"23_3":3,"23_5":3,"23_2":1,"23_6":1,
      "24_4":4,"24_3":3,"24_5":3,"24_2":1,"24_6":1,"25_5":4,"25_4":3,"25_6":3,"25_3":1,
      "26_5":4,"26_4":3,"26_6":3,"26_3":1,"27_5":4,"27_4":3,"27_6":3,"27_3":1,
      "28_5":4,"28_4":3,"28_6":3,"28_3":1,"29_5":4,"29_4":3,"29_6":3,"29_3":1,
      "30_5":4,"30_4":3,"30_6":3,"30_3":1,"31_4":4,"31_3":3,"31_5":3,"31_2":1,"31_6":1,
      "32_4":4,"32_3":3,"32_5":3,"32_2":1,"32_6":1,"33_3":4,"33_2":3,"33_4":3,"33_1":1,"33_5":1,
      "34_2":4,"34_1":3,"34_3":3,"34_0":1,"34_4":1,"35_2":4,"35_1":3,"35_3":3,"35_0":1,"35_4":1,
      "36_1":4,"36_0":3,"36_2":3,"36_3":1,"37_1":4,"37_0":3,"37_2":3,"37_3":1,
      "38_1":4,"38_0":3,"38_2":3,"38_3":1,"39_1":4,"39_0":3,"39_2":3,"39_3":1,
      "40_1":4,"40_0":3,"40_2":3,"40_3":1,"41_1":4,"41_0":3,"41_2":3,"41_3":1,
      "42_2":4,"42_1":3,"42_3":3,"42_0":1,"42_4":1,"43_2":4,"43_1":3,"43_3":3,"43_0":1,"43_4":1,
      "44_3":4,"44_2":3,"44_4":3,"44_1":1,"44_5":1,"45_4":4,"45_3":3,"45_5":3,"45_2":1,"45_6":1,
      "46_4":4,"46_3":3,"46_5":3,"46_2":1,"46_6":1,"47_5":4,"47_4":3,"47_6":3,"47_3":1,
      "48_5":4,"48_4":3,"48_6":3,"48_3":1,"49_5":4,"49_4":3,"49_6":3,"49_3":1,
      "50_5":4,"50_4":3,"50_6":3,"50_3":1,"51_5":4,"51_4":3,"51_6":3,"51_3":1,
      "52_5":4,"52_4":3,"52_6":3,"52_3":1
    },
    tags: ["Art", "Workflows"],
    likes: 1200, forks: 420, views: 8200,
  },
  {
    id: "preset-wolf",
    title: "Wolfpack Architecture",
    description: "A fully geometric wolf character head built symmetrically using custom branch densities, emphasizing modern team coordination.",
    graphData: {
      "20_0":4,"32_0":4,"21_1":4,"31_1":4,"22_2":3,"30_2":1,
      "24_3":1,"28_3":4,"23_3":3,"29_3":3,"26_6":4,"26_5":4,"25_5":3,"27_5":3,"26_4":3,
      "18_1":2,"34_1":2,"19_1":2,"33_1":2,"20_2":2,"32_2":2,"21_3":2,"31_3":2,"22_3":2,
      "30_3":2,"23_4":2,"29_4":2,"15_1":1,"18_4":1,"21_0":1,"27_6":1,"33_5":1,"36_1":1
    },
    tags: ["Logos", "Art"],
    likes: 890, forks: 210, views: 5400,
  },
  {
    id: "preset-system",
    title: "System Core Commit Pattern",
    description: "Intricate digital matrix spelling out SYSTEM in pixel typography on the active grid — great for themed contribution years.",
    graphData: {
      "6_1":3,"7_1":3,"8_1":3,"9_1":3,"10_1":3,"6_2":3,"6_3":3,"7_3":3,"8_3":3,"9_3":3,
      "10_3":3,"10_4":3,"6_5":3,"7_5":3,"8_5":3,"9_5":3,"10_5":3,
      "13_1":3,"17_1":3,"13_2":3,"17_2":3,"14_3":3,"15_3":3,"16_3":3,"15_4":3,"15_5":3,
      "20_1":3,"21_1":3,"22_1":3,"23_1":3,"24_1":3,"20_2":3,"20_3":3,"21_3":3,"22_3":3,
      "23_3":3,"24_3":3,"24_4":3,"20_5":3,"21_5":3,"22_5":3,"23_5":3,"24_5":3,
      "27_1":3,"28_1":3,"29_1":3,"30_1":3,"31_1":3,"29_2":3,"29_3":3,"29_4":3,"29_5":3,
      "34_1":3,"35_1":3,"36_1":3,"37_1":3,"38_1":3,"34_2":3,"34_3":3,"35_3":3,"36_3":3,
      "37_3":3,"34_4":3,"34_5":3,"35_5":3,"36_5":3,"37_5":3,"38_5":3,
      "41_1":3,"45_1":3,"41_2":3,"42_2":3,"44_2":3,"45_2":3,"41_3":3,"43_3":3,"45_3":3,
      "41_4":3,"45_4":3,"41_5":3,"45_5":3
    },
    tags: ["Text", "Art"],
    likes: 543, forks: 98, views: 3100,
  },
  {
    id: "preset-monorepo",
    title: "Standard Monorepo",
    description: "The standard multi-branch configuration model featuring full trunk support, parallel staging pipelines, and tag releases.",
    graphData: {
      "0_3":2,"1_3":2,"2_3":2,"3_3":2,"4_3":2,"5_3":2,"6_3":2,"7_3":2,"8_3":2,"9_3":2,
      "10_3":2,"11_3":2,"12_3":2,"13_3":2,"14_3":2,"15_3":2,"16_3":2,"17_3":2,"18_3":2,
      "19_3":4,"20_3":2,"21_3":2,"22_3":2,"23_3":2,"24_3":2,"25_3":2,"26_3":2,"27_3":2,
      "28_3":2,"29_3":2,"30_3":2,"31_3":2,"32_3":2,"33_3":2,"34_3":2,"35_3":4,"36_3":2,
      "37_3":2,"38_3":2,"39_3":2,"40_3":2,"41_3":2,"42_3":2,"43_3":4,"44_3":2,"45_3":2,
      "46_3":2,"47_3":2,"48_3":2,"49_3":2,"50_3":2,"51_3":2,"52_3":2,
      "10_2":3,"11_1":4,"12_1":4,"13_1":4,"14_1":4,"15_1":4,"16_1":4,"17_1":4,"18_1":4,"19_2":3,
      "22_4":3,"23_5":3,"24_5":4,"25_5":3,"26_5":3,"27_5":4,"28_5":3,"29_5":3,
      "30_5":4,"31_5":3,"32_5":3,"33_5":4,"34_5":3,"35_4":3,
      "40_2":4,"41_2":4,"42_2":4
    },
    tags: ["Workflows"],
    likes: 3400, forks: 1200, views: 12000,
  },
];

async function main() {
  console.log("Seeding started...");

  // 1. Create System User
  const creator = await prisma.user.upsert({
    where: { id: "preset-author" },
    update: {},
    create: {
      id: "preset-author",
      name: "Studio Presets",
      email: "presets@gitgraph.studio",
      username: "presets",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      bio: "Official GitGraph Studio system preset contribution designs.",
    }
  });

  console.log(`✓ System user ready: @${creator.username}`);

  // 2. Loop through preset designs and upsert them
  for (const preset of PRESET_DESIGNS) {
    const design = await prisma.design.upsert({
      where: { id: preset.id },
      update: {
        title: preset.title,
        description: preset.description,
        graphData: preset.graphData,
        visibility: "PUBLIC",
      },
      create: {
        id: preset.id,
        title: preset.title,
        description: preset.description,
        graphData: preset.graphData,
        visibility: "PUBLIC",
        creatorId: creator.id,
      }
    });

    console.log(`  ✓ Upserted: ${design.title}`);

    // Create and bind tags
    for (const tagName of preset.tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName }
      });

      await prisma.designTag.upsert({
        where: { designId_tagId: { designId: design.id, tagId: tag.id } },
        update: {},
        create: { designId: design.id, tagId: tag.id }
      });
    }
  }

  console.log(`\n✅ Seeding complete — ${PRESET_DESIGNS.length} designs uploaded.`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
