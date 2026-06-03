import { GalleryItem, GridPixel } from '../types';

// Let's generate a cool wavy pattern for the Nebula Framework Flow
const getNebulaPixels = (): GridPixel[] => {
  const pixels: GridPixel[] = [];
  for (let w = 0; w < 53; w++) {
    const center = 3 + Math.round(2.5 * Math.sin(w / 3.5));
    // Core of the wave
    pixels.push({ w, d: center, level: 4 });
    
    // Surrounding aura
    if (center - 1 >= 0) pixels.push({ w, d: center - 1, level: 3 });
    if (center + 1 < 7) pixels.push({ w, d: center + 1, level: 3 });
    if (center - 2 >= 0) pixels.push({ w, d: center - 2, level: 1 });
    if (center + 2 < 7) pixels.push({ w, d: center + 2, level: 1 });

    // Add some random sparkling dots
    if (Math.random() > 0.8) {
      const randD = Math.floor(Math.random() * 7);
      if (Math.abs(randD - center) > 2) {
        pixels.push({ w, d: randD, level: Math.floor(Math.random() * 3) + 1 });
      }
    }
  }
  return pixels;
};

// Let's generate a wolf silhouette / geometry for Wolfpack Architecture
const getWolfPixels = (): GridPixel[] => {
  const pixels: GridPixel[] = [];
  // Center is week 26
  // We can draw a beautiful symmetric geometric structure: a V-shape wolf head outline!
  const centerW = 26;
  const headWidth = 20;
  
  // Ear tips
  pixels.push({ w: centerW - 6, d: 0, level: 4 });
  pixels.push({ w: centerW + 6, d: 0, level: 4 });
  pixels.push({ w: centerW - 5, d: 1, level: 4 });
  pixels.push({ w: centerW + 5, d: 1, level: 4 });
  pixels.push({ w: centerW - 4, d: 2, level: 3 });
  pixels.push({ w: centerW + 4, d: 2, level: 3 });

  // Eyebrows
  pixels.push({ w: centerW - 2, d: 3, level: 4 });
  pixels.push({ w: centerW + 2, d: 3, level: 4 });
  pixels.push({ w: centerW - 3, d: 3, level: 3 });
  pixels.push({ w: centerW + 3, d: 3, level: 3 });

  // Nose and snout down the center
  pixels.push({ w: centerW, d: 6, level: 4 });
  pixels.push({ w: centerW, d: 5, level: 4 });
  pixels.push({ w: centerW - 1, d: 5, level: 3 });
  pixels.push({ w: centerW + 1, d: 5, level: 3 });
  pixels.push({ w: centerW, d: 4, level: 3 });

  // Outer cheek outlines
  for (let i = 0; i < 6; i++) {
    pixels.push({ w: centerW - 8 + i, d: 1 + Math.floor(i / 1.5), level: 2 });
    pixels.push({ w: centerW + 8 - i, d: 1 + Math.floor(i / 1.5), level: 2 });
  }

  // Symmetric background network lines representing the geometry
  for (let w = 15; w < 38; w++) {
    if (w % 3 === 0) {
      pixels.push({ w, d: (w % 7), level: 1 });
    }
  }

  return pixels;
};

// "SYSTEM" typography formed by small git commits
const getSystemPixels = (): GridPixel[] => {
  const pixels: GridPixel[] = [];
  
  // Letters structure for word: S-Y-S-T-E-M
  // Standard 5x5 layout with 2 spacing columns in a 53 column wide grid
  // Start horizontal position around week 6
  const word = "SYSTEM";
  const startW = 6;
  const colSpacing = 2;
  const charWidth = 5;

  const charGlyphs: Record<string, number[][]> = {
    'S': [
      [1,1,1,1,1],
      [1,0,0,0,0],
      [1,1,1,1,1],
      [0,0,0,0,1],
      [1,1,1,1,1]
    ],
    'Y': [
      [1,0,0,0,1],
      [1,0,0,0,1],
      [0,1,1,1,0],
      [0,0,1,0,0],
      [0,0,1,0,0]
    ],
    'T': [
      [1,1,1,1,1],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0]
    ],
    'E': [
      [1,1,1,1,1],
      [1,0,0,0,0],
      [1,1,1,1,0],
      [1,0,0,0,0],
      [1,1,1,1,1]
    ],
    'M': [
      [1,0,0,0,1],
      [1,1,0,1,1],
      [1,0,1,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1]
    ]
  };

  // Map 5 rows of letter to 5 days of week (leaving top and bottom blank as margins, i.e., days 1-5)
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const glyph = charGlyphs[char];
    if (!glyph) continue;

    const charStartW = startW + i * (charWidth + colSpacing);

    for (let r = 0; r < 5; r++) { // Row of glyph (corresponds to d: r + 1)
      const d = r + 1;
      for (let c = 0; c < 5; c++) { // Col of glyph (corresponds to w)
        if (glyph[r][c] === 1) {
          const w = charStartW + c;
          pixels.push({ w, d, level: 3 });
        }
      }
    }
  }

  // Surround screen with background binary noise (1 and 0 representation in Level 1)
  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      // Avoid overwriting letters
      const insideLetters = w >= startW && w < startW + word.length * (charWidth + colSpacing) && d >= 1 && d <= 5;
      if (!insideLetters && Math.random() > 0.88) {
        pixels.push({ w, d, level: 1 });
      }
    }
  }

  return pixels;
};

// "Standard Monorepo" branch structure
const getMonorepoPixels = (): GridPixel[] => {
  const pixels: GridPixel[] = [];

  // Main stable trunk (main line) on d: 3 (Wednesday) extending across all weeks
  for (let w = 0; w < 53; w++) {
    pixels.push({ w, d: 3, level: 2 });
  }

  // Branch 1: Feature branch on top (d: 1) starting week 10 to 18, merging back on week 19
  // Branch points
  pixels.push({ w: 10, d: 2, level: 3 });
  for (let w = 11; w <= 18; w++) {
    pixels.push({ w, d: 1, level: 4 });
  }
  pixels.push({ w: 19, d: 2, level: 3 });

  // Branch 2: Long term support / heavy work branch at bottom (d: 5) starting week 22 to 35
  pixels.push({ w: 22, d: 4, level: 3 });
  for (let w = 23; w <= 34; w++) {
    pixels.push({ w, d: 5, level: 3 });
    // Add commits to represent team working here
    if (w % 3 === 0) pixels.push({ w, d: 5, level: 4 });
  }
  pixels.push({ w: 35, d: 4, level: 3 });

  // Branch 3: Short security patch week 40 to 43
  pixels.push({ w: 40, d: 2, level: 4 });
  pixels.push({ w: 41, d: 2, level: 4 });
  pixels.push({ w: 42, d: 2, level: 4 });

  // Add merge points (Level 4 highlights)
  pixels.push({ w: 19, d: 3, level: 4 }); // Merged back main branch
  pixels.push({ w: 35, d: 3, level: 4 }); // Merged back lts branch
  pixels.push({ w: 43, d: 3, level: 4 }); // Merged security patch

  return pixels;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'nebula-framework-flow',
    title: 'Nebula Framework Flow',
    author: 'astrodev',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChJap9xtxarZUW67XIP2Q4uAvyfX3eaNIK_THPwQMGqsTLZOX-Ap2PcwJsToc3EaiZPAH24jPF8OoVo4YsRfWwgMkbMW_VPqmQzxZsHLzsYHJIdNwMoI3DDPO-v5iq5pDhWDVCwLU4gKlZa4iBpspNiXktTCR9e6cKR8W8b1nkABjXZ_-CsK35qs3j4WgADUuHBqCMD492cIsGUy1ss_3slfQ9KQydFctKdMmwJTLAzVrMeY8e1mB9zApEVZwWG8GUb1RwG8iSGERK',
    likes: 1200,
    downloads: 842,
    tags: ['Art', 'Workflows'],
    pixels: getNebulaPixels(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEkIstZ1MppKoziA-7e7c9q6yCVYYbKJAUmV-o-X__glLrDQSpbmuf1P_Ovn77ZSdYoACI-Tq_J-33MNT32yfD3Uj74U3GLuRLCVYrZXK_35bIOo4CFEfNnaWdqovd-mxxhf8aGONsjEnDuOPTkiQrMXvlIS7AkuWAlU0T57amDoW6IpzfH7RJuuAfdqgSFGGVlD9OwwuAQ02TN6836XDdneLyWH4kRGOAgMYNtMjtGqswDuKcA2gKqoXFOW5vzPPKjHwzXJoB55RE',
    description: 'A beautiful git representation structure shaped like an organic constellation wave representing dynamic branches and merge pipelines.'
  },
  {
    id: 'wolfpack-architecture',
    title: 'Wolfpack Architecture',
    author: 'luna_tech',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzF3LzH0IQQVBfoOUrdCOcIhBJ52JH0EQaZ4VoUrtpKgGj7PeYlyysI_0J3m--Bmamn18OH6N0nQ9HKupTIr7A4ookIyIzV5twGDUMoge2HO6CZJjwJuiInKHJZYXPJ0azoM4wPyDRt9LK-qrniwdls-TS-T3YzSX__xeLQ1GlgW3Daxyodbo-x8v1Phnv_H5apoXpsVKFjC3vb2wrWYtoDaSGYKusRdWaxPudam5-zzN2QmcGrLzmHx9Kug55jel_1tJLM8Ll5YYP',
    likes: 890,
    downloads: 410,
    tags: ['Logos', 'Art'],
    pixels: getWolfPixels(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH796B4EEspTMEAociJJBTSXQKXJF8WWy3ttudi8r6MPDHU-pI6TDcO7Ii14bZt5gZJHahVzmv5ZDtuGSGQfUBapDoT0yMoLy_JEvDxEZRj-Sj4JSlKZRgLaBT4kQirO1KTRXcwdk4CBvSLQEWHnDRv5heTYX4w0_fvid3xKhk92Pds5zg11alBHtiTDMYXyFNmq-jgWC6Ilqs4bWuZVDs_nNRGb3ajs-iC_vYMkW4EhXk9_ADN-Nw3hqFItdUZAhelEJB3ATbahK7',
    description: 'A fully geometric wolf character head built symmetrically using custom branch densities, emphasizing modern team coordination.'
  },
  {
    id: 'system-core-commit',
    title: 'System Core Commit Pattern',
    author: 'sysadmin',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0EI03HIt8MJ914_1EhcHvty3f8Fm-zn5zxJMVOH9idt_R2peFDU2dPWhQFVR5TWTM5-EZ8jT7XcNVRuQPVPS-9ADlcLlUTWv_QYPUZwq7JVNKDjRQ_KVeDk39Gh7y4RUv-y1Un4XCwiXj1T1co-cCMAUNAMJ-5sXeLIwlgdDO7jGEHhz87QpRkccI41zTWSfcPqoW5VUiwY0k3-P8cuBwX028q8Y6AeoeUaH7zSo867OYtCZgzIEVv8B8MFIQbKH1x6l8QnTftxp2',
    likes: 543,
    downloads: 210,
    tags: ['Text', 'Art'],
    pixels: getSystemPixels(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIZQ8zeeoyp73KvmF1wMPvYqOG_QU1kxOcB5xtRln4opfMY-wykY1O9pVCLn29Zg6pluT36jrdMHiU8nmlzqVSAboPirY8onH9n0n2dDUZT5BC21ZhgQC0V5oW5ic8VIr8NOZFK8mwSUc1myx55mMws_Vw6z6lliFg8ALNnyueihsI5e4dagTNUFQpOxPgPI4jBYOS-xVzlYzi_DzcY_u-74FAAtByvYxvBkqJapYR4mBcl3ql1jAb2mlvbg0b2tgVRUq3yqic9poN',
    description: 'Intricate digital matrix spelling out standard SYSTEM terminals on the active grid surrounded by high-contrast noise.'
  },
  {
    id: 'standard-monorepo',
    title: 'Standard Monorepo',
    author: 'gitgraph_official',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_XYUKDqC20pGeKgz9sV5Sh5N1Oj9t4c68h_a0RI8AmC_EQWx_6ZePqcmfDoXmCtLAAFzo32fC8TACr_5BEMsbynwfAyxp4kcMAwfZBDYIVuugro46ltiQOKmhD606QlBnZv3VyUeo9WCzzPr4qrC2_p8ncAxB6bEX0Dm2jWrI9rF5c6q6SgodlGi7SQ6242nfbKyP3tmasKwxFrhsA1t0HKRwLggrsN2UmYwzc8b3DM2ojgCgBLtt-gUtoMrtjX2p8PyNUCPjQuxk',
    likes: 3400,
    downloads: 12000,
    tags: ['Workflows'],
    pixels: getMonorepoPixels(),
    imageUrl: '',
    isTemplate: true,
    description: 'The standard multi-branch configuration model featuring full trunk support, parallel staging pipelines, and tag releases.'
  }
];
