import React, { useState, useEffect, useRef } from 'react';
import { 
  Hexagon, 
  Edit3, 
  Grid3X3, 
  FileText, 
  GitBranch, 
  Sliders, 
  Settings, 
  HelpCircle, 
  Download, 
  Save, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Paintbrush, 
  Eraser, 
  PaintBucket, 
  Square, 
  Play, 
  Search, 
  Heart, 
  Compass, 
  Sparkles, 
  Code, 
  Copy, 
  ArrowRight, 
  Info, 
  Check, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Menu, 
  Github, 
  FolderLock, 
  User, 
  Plus, 
  Minus,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Upload
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { GALLERY_ITEMS } from './data/galleryData';
import { PIXEL_FONTS } from './utils/pixelFonts';
import { Tool, FontStyle, GalleryItem, GridPixel, SavedDesign, UserSession, UserSettings } from './types';

const EMOJI_PATTERNS: Record<string, { name: string; visual: string; grid: number[][] }> = {
  smile: {
    name: 'Smiley Face',
    visual: '🙂',
    grid: [
      [0, 2, 3, 3, 3, 2, 0],
      [2, 0, 0, 0, 0, 0, 2],
      [3, 0, 4, 0, 4, 0, 3],
      [3, 0, 0, 0, 0, 0, 3],
      [3, 4, 0, 0, 0, 4, 3],
      [2, 0, 4, 4, 4, 0, 2],
      [0, 2, 3, 3, 3, 2, 0]
    ]
  },
  wink: {
    name: 'Winking Smile',
    visual: '😉',
    grid: [
      [0, 2, 3, 3, 3, 2, 0],
      [2, 0, 0, 0, 0, 0, 2],
      [3, 0, 4, 0, 0, 0, 3],
      [3, 0, 0, 0, 4, 4, 3],
      [3, 4, 0, 0, 0, 0, 3],
      [2, 0, 4, 4, 4, 0, 2],
      [0, 2, 3, 3, 3, 2, 0]
    ]
  },
  heart: {
    name: 'Heart Arc',
    visual: '❤️',
    grid: [
      [0, 4, 4, 0, 4, 4, 0],
      [4, 4, 4, 4, 4, 4, 4],
      [4, 4, 4, 4, 4, 4, 4],
      [0, 4, 4, 4, 4, 4, 0],
      [0, 0, 4, 4, 4, 0, 0],
      [0, 0, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ]
  },
  ghost: {
    name: 'Spooky Ghost',
    visual: '👻',
    grid: [
      [0, 0, 3, 3, 3, 0, 0],
      [0, 3, 4, 4, 4, 3, 0],
      [3, 4, 1, 4, 1, 4, 3],
      [3, 4, 4, 3, 4, 4, 3],
      [3, 4, 4, 4, 4, 4, 3],
      [3, 4, 4, 4, 4, 4, 3],
      [3, 0, 3, 0, 3, 0, 3]
    ]
  },
  star: {
    name: 'Cosmic Star',
    visual: '⭐',
    grid: [
      [0, 0, 0, 4, 0, 0, 0],
      [0, 0, 4, 4, 4, 0, 0],
      [4, 4, 4, 4, 4, 4, 4],
      [0, 4, 4, 4, 4, 4, 0],
      [0, 0, 4, 4, 4, 0, 0],
      [0, 4, 4, 0, 4, 4, 0],
      [4, 0, 0, 0, 0, 0, 4]
    ]
  },
  alien: {
    name: 'Space Invader',
    visual: '👾',
    grid: [
      [0, 3, 0, 0, 0, 3, 0],
      [0, 0, 3, 0, 3, 0, 0],
      [0, 4, 4, 4, 4, 4, 0],
      [4, 4, 1, 4, 1, 4, 4],
      [4, 4, 4, 4, 4, 4, 4],
      [0, 0, 4, 0, 4, 0, 0],
      [0, 4, 0, 0, 0, 4, 0]
    ]
  },
  skull: {
    name: 'Doom Skull',
    visual: '💀',
    grid: [
      [0, 3, 4, 4, 4, 3, 0],
      [3, 4, 4, 4, 4, 4, 3],
      [4, 4, 1, 4, 1, 4, 4],
      [4, 4, 4, 1, 4, 4, 4],
      [0, 4, 4, 4, 4, 4, 0],
      [0, 3, 4, 1, 4, 3, 0],
      [0, 0, 3, 3, 3, 0, 0]
    ]
  },
  thumbsup: {
    name: 'Thumbs Up',
    visual: '👍',
    grid: [
      [0, 0, 0, 3, 3, 0, 0],
      [0, 0, 3, 3, 4, 0, 0],
      [0, 0, 3, 4, 4, 4, 4],
      [3, 3, 3, 4, 4, 4, 4],
      [3, 4, 4, 4, 4, 4, 4],
      [3, 4, 4, 4, 0, 0, 0],
      [0, 3, 3, 0, 0, 0, 0]
    ]
  }
};

export default function App() {
  // Navigation Tabs with custom Settings, Profile, login pages support
  const [activeTab, setActiveTab] = useState<'editor' | 'gallery' | 'docs' | 'templates' | 'settings' | 'profile' | 'auth'>('editor');

  // Load User Session & Settings from localStorage with safety defaults
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('gitgraph_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'username' in parsed) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      username: 'johndoe',
      email: 'john.doe@example.com',
      name: 'John Doe',
      bio: 'Principal UI Crafter and Open Source Evangelist. Passionate about beautiful commits and editorial design.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOrHKvKLL5jtP2G1e4XbJeR279wL2oVSdLYIq31z3PRF5cyNSFVQ9dFwBi0X-d3niYmocU6FTSLeY-WP7yvrTWAtjmy7sNhXp6Q4sw3OF09eA2MYK4ahDpGHjj_OGeNhNBp8xJUXPGiZ6POeTcQljCMhFNXvcz5ohv2uk_WpGLowlWP5wSC4ISkbixPNw3VBqRsaSyPpd14Q1pZCOFQByHE5RG90x2zbmfmim09GtfJOlxttXD60ITrFtc514phtv72VhM1aNKoDoO',
      isLoggedIn: true
    };
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('gitgraph_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'gridTheme' in parsed) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      gridBorders: true,
      gridTheme: 'github',
      showTooltips: true,
      defaultIntensity: 4
    };
  });

  // Track state sync with local storage
  useEffect(() => {
    localStorage.setItem('gitgraph_session', JSON.stringify(userSession));
  }, [userSession]);

  useEffect(() => {
    localStorage.setItem('gitgraph_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Grid Configuration: 53 columns (weeks), 7 rows (days, Sunday which is row 0 to Saturday which is row 6)
  const WEEKS = 53;
  const DAYS = 7;

  // Active Grid Data: represented as a Record keyed by `${w}_${d}` containing level 0-4
  const [pixels, setPixels] = useState<Record<string, number>>({});

  // Saved Designs list for Profile visual dashboard
  const [sessionSavedDesigns, setSessionSavedDesigns] = useState<SavedDesign[]>([]);

  useEffect(() => {
    const listJSON = localStorage.getItem('gitgraph_saved_designs');
    if (listJSON) {
      try {
        setSessionSavedDesigns(JSON.parse(listJSON));
      } catch (e) {}
    }
  }, [activeTab, pixels]);

  // History Undo & Redo lists
  const [undoStack, setUndoStack] = useState<Record<string, number>[]>([]);
  const [redoStack, setRedoStack] = useState<Record<string, number>[]>([]);

  // Selected Editor Configurations
  const [activeTool, setActiveTool] = useState<Tool>('brush');
  const [activeIntensity, setActiveIntensity] = useState<number>(4); // Default level 4 (hex #39d353)
  const [zoomLevel, setZoomLevel] = useState<number>(100); // Zoom percents (e.g. 100, 120, 80 etc.)
  
  // Design Name Configuration
  const [designName, setDesignName] = useState<string>('Standard_Monorepo.json');
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Text Generator Accordion configs
  const [textInput, setTextInput] = useState<string>('HELLO');
  const [textFontStyle, setTextFontStyle] = useState<FontStyle>('5x7');
  const [isPropExpanded, setIsPropExpanded] = useState<boolean>(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState<boolean>(true);

  // Emoji Generator Accordion configs
  const [selectedEmoji, setSelectedEmoji] = useState<string>('smile');
  const [isEmojiExpanded, setIsEmojiExpanded] = useState<boolean>(true);
  const [stampColumnOffset, setStampColumnOffset] = useState<number>(23);

  // Pattern Nudge/Shift configs
  const [isShiftExpanded, setIsShiftExpanded] = useState<boolean>(true);

  // Dialog Open States
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState<boolean>(false);
  const [isPublishToGalleryDialogOpen, setIsPublishToGalleryDialogOpen] = useState<boolean>(false);

  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('gitgraph_sidebar_collapsed');
    if (saved !== null) {
      return saved === 'true';
    }
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 1024;
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width <= 1024;
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      if (tablet) {
        const saved = localStorage.getItem('gitgraph_sidebar_collapsed');
        if (saved === null) {
          setSidebarCollapsed(true);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('gitgraph_sidebar_collapsed', String(next));
      return next;
    });
  };

  const getMainPaddingLeft = () => {
    if (isMobile) return 'pl-0';
    return sidebarCollapsed ? 'pl-[72px]' : 'pl-[260px]';
  };
  
  // Custom Created designs that are loaded in local storage gallery
  const [customGalleryItems, setCustomGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('gitgraph_custom_gallery');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Sync custom gallery to local Storage
  useEffect(() => {
    localStorage.setItem('gitgraph_custom_gallery', JSON.stringify(customGalleryItems));
  }, [customGalleryItems]);

  // Form Fields for new file and publish to gallery
  const [newFileTitle, setNewFileTitle] = useState<string>('untitled_release_branch');
  const [newPresetType, setNewPresetType] = useState<string>('blank');
  
  const [publishTitle, setPublishTitle] = useState<string>('');
  const [publishDescription, setPublishDescription] = useState<string>('');
  const [publishSelectedTags, setPublishSelectedTags] = useState<string[]>(['Art']);

  // Gallery Contexts
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Trending'); // "Trending", "Latest", "Featured"
  const [selectedTag, setSelectedTag] = useState<string>('All'); // "All", "Art", "Logos", "Text", "Workflows"

  // Feedback Notifications/Toasts (e.g. copied code, exported json, design saved)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Shape drawing context (brush stroke reference)
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [dragStartPoint, setDragStartPoint] = useState<{ w: number; d: number } | null>(null);
  const [dragEndPoint, setDragEndPoint] = useState<{ w: number; d: number } | null>(null);

  // Bresenham line drawing helper for Shape tool preview
  const getBresenhamPoints = (x0: number, y0: number, x1: number, y1: number) => {
    const points: { w: number; d: number }[] = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    // Fast bounds safety loop
    let count = 0;
    while (count < 100) {
      if (x >= 0 && x < WEEKS && y >= 0 && y < DAYS) {
        points.push({ w: x, d: y });
      }
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
      count++;
    }
    return points;
  };

  // Rectangle points helper for Shape tool
  const getRectanglePoints = (x0: number, y0: number, x1: number, y1: number) => {
    const points: { w: number; d: number }[] = [];
    const minW = Math.min(x0, x1);
    const maxW = Math.max(x0, x1);
    const minD = Math.min(y0, y1);
    const maxD = Math.max(y0, y1);

    // Outline points representing the bounds
    for (let w = minW; w <= maxW; w++) {
      points.push({ w, d: minD });
      points.push({ w, d: maxD });
    }
    for (let d = minD + 1; d < maxD; d++) {
      points.push({ w: minW, d });
      points.push({ w: maxW, d });
    }
    return points;
  };

  // Preload Standard Monorepo design on load
  useEffect(() => {
    const monorepo = GALLERY_ITEMS.find(item => item.id === 'standard-monorepo');
    if (monorepo) {
      const initial: Record<string, number> = {};
      monorepo.pixels.forEach(p => {
        initial[`${p.w}_${p.d}`] = p.level;
      });
      setPixels(initial);
    }
    
    // Add global mouseup event listener to close dragging seamlessly
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Quick toast announcer helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Save changes to current session history
  const recordHistory = (newPixels: Record<string, number>) => {
    setUndoStack(prev => [...prev, pixels]);
    setRedoStack([]); // Clear redo
    setPixels(newPixels);
  };

  // Undo triggers
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, pixels]);
    setPixels(previous);
    triggerToast('Action undone', 'info');
  };

  // Redo triggers
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, pixels]);
    setPixels(next);
    triggerToast('Action redone', 'info');
  };

  // Clear Canvas back to clean state
  const handleClearGrid = () => {
    recordHistory({});
    triggerToast('Grid cleared successfully', 'info');
  };

  // Zoom manipulation
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 70));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Create / Open a fresh customized file workspace with presets
  const handleCreateNewFile = () => {
    let sanitizedName = newFileTitle.trim();
    if (!sanitizedName) {
      triggerToast('Filename cannot be empty', 'error');
      return;
    }
    if (!sanitizedName.toLowerCase().endsWith('.json')) {
      sanitizedName = `${sanitizedName}.json`;
    }

    let initialPixels: Record<string, number> = {};

    if (newPresetType === 'wave') {
      for (let w = 0; w < WEEKS; w++) {
        const d = Math.round(3 + 2.2 * Math.sin(w / 4));
        if (d >= 0 && d < DAYS) {
          initialPixels[`${w}_${d}`] = 4;
          if (d - 1 >= 0) initialPixels[`${w}_${d - 1}`] = 2;
          if (d + 1 < DAYS) initialPixels[`${w}_${d + 1}`] = 2;
        }
      }
    } else if (newPresetType === 'starry') {
      for (let i = 0; i < 65; i++) {
        const w = Math.floor(Math.random() * WEEKS);
        const d = Math.floor(Math.random() * DAYS);
        initialPixels[`${w}_${d}`] = Math.floor(Math.random() * 4) + 1;
      }
    } else if (newPresetType === 'binary_checker') {
      for (let w = 0; w < WEEKS; w++) {
        for (let d = 0; d < DAYS; d++) {
          if ((w + d) % 2 === 0) {
            initialPixels[`${w}_${d}`] = 2;
          }
        }
      }
    }

    setPixels(initialPixels);
    setDesignName(sanitizedName);
    setUndoStack([]);
    setRedoStack([]);
    setIsNewFileDialogOpen(false);
    triggerToast(`Opened new workspace file: "${sanitizedName}"`, 'success');
  };

  // Publish current customized design graph to local Community Gallery
  const handlePublishToGallery = () => {
    const rawTitle = publishTitle.trim() || designName.replace('.json', '').replace(/[_-]+/g, ' ');
    const authorName = userSession?.username || 'anonymous_coder';
    const authorAvatar = userSession?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    
    // Map existing active pixels to GridPixel format
    const gridPixels: GridPixel[] = Object.entries(pixels)
      .filter(([_, level]) => (level as number) > 0)
      .map(([key, level]) => {
        const [w, d] = key.split('_').map(Number);
        return { w, d, level: level as number };
      });

    if (gridPixels.length === 0) {
      triggerToast('Cannot publish an empty graph! Draw something first.', 'error');
      return;
    }

    const newGalleryItem: GalleryItem = {
      id: `custom-design-${Date.now()}`,
      title: rawTitle,
      author: authorName,
      authorAvatar: authorAvatar,
      likes: Math.floor(Math.random() * 12) + 1,
      downloads: 0,
      tags: publishSelectedTags.length > 0 ? publishSelectedTags : ['Art'],
      pixels: gridPixels,
      imageUrl: '', // Nicely triggers placeholder/interactive drawing preview in community list
      description: publishDescription.trim() || 'A beautiful contribution pattern generated using GitGraph Studio.'
    };

    setCustomGalleryItems(prev => [newGalleryItem, ...prev]);
    setIsPublishToGalleryDialogOpen(false);
    
    // Switch to gallery tab and show success toast
    setActiveTab('gallery');
    
    // Clear publish modal input fields
    setPublishTitle('');
    setPublishDescription('');
    setPublishSelectedTags(['Art']);
    
    triggerToast(`Successfully published "${rawTitle}" to Community Gallery! 🎉`, 'success');
  };

  // Save Design inside localStorage
  const handleSaveDesign = () => {
    try {
      const savedListJSON = localStorage.getItem('gitgraph_saved_designs');
      const savedList: SavedDesign[] = savedListJSON ? JSON.parse(savedListJSON) : [];
      
      const pixelArray: GridPixel[] = Object.entries(pixels).map(([key, val]) => {
        const [w, d] = key.split('_').map(Number);
        return { w, d, level: val as number };
      });

      const existingIndex = savedList.findIndex(item => item.name === designName);
      const newDesign: SavedDesign = {
        id: existingIndex !== -1 ? savedList[existingIndex].id : Math.random().toString(36).substr(2, 9),
        name: designName,
        pixels: pixelArray,
        updatedAt: new Date().toISOString()
      };

      if (existingIndex !== -1) {
        savedList[existingIndex] = newDesign;
      } else {
        savedList.push(newDesign);
      }

      localStorage.setItem('gitgraph_saved_designs', JSON.stringify(savedList));
      triggerToast(`Saved as "${designName}"`, 'success');
    } catch (e) {
      console.error(e);
      triggerToast('Unable to persist design locally', 'error');
    }
  };

  // Export design.json configuration file download
  const handleExportJson = () => {
    const activePixels: GridPixel[] = Object.entries(pixels)
      .filter(([_, level]) => (level as number) > 0)
      .map(([key, level]) => {
        const [w, d] = key.split('_').map(Number);
        return { w, d, level: level as number };
      });

    const exportData = {
      version: "1.0",
      name: designName.replace('.json', ''),
      dimensions: {
        weeks: WEEKS,
        days: DAYS
      },
      pixels: activePixels
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = designName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Exported "${designName}" download complete!`, 'success');
  };

  // Load a Saved Design or Gallery template directly into working canvas
  const handleLoadItem = (item: GalleryItem) => {
    const newPixels: Record<string, number> = {};
    item.pixels.forEach(p => {
      newPixels[`${p.w}_${p.d}`] = p.level;
    });
    
    setPixels(newPixels);
    setDesignName(item.isTemplate ? `${item.title.replace(/\s+/g, '_')}.json` : `${item.title.replace(/\s+/g, '_')}_Remix.json`);
    setUndoStack([]);
    setRedoStack([]);
    
    setActiveTab('editor');
    triggerToast(`Loaded "${item.title}" into workspace!`, 'success');
  };

  // Text Generator: Places pixel fonts directly into the exact middle of the canvas
  const handleApplyTextToGrid = () => {
    if (!textInput.trim()) {
      triggerToast('Please enter text value', 'error');
      return;
    }

    const uppercase = textInput.toUpperCase();
    const fontGlyphs = PIXEL_FONTS[textFontStyle];
    const letterSpacing = 1; // 1 blank column between keys
    
    // Calculate total character width of text string
    let totalWidth = 0;
    for (let i = 0; i < uppercase.length; i++) {
      const char = uppercase[i];
      const glyph = fontGlyphs[char] || fontGlyphs[' '];
      const charWidth = glyph[0] ? glyph[0].length : 3;
      totalWidth += charWidth + (i < uppercase.length - 1 ? letterSpacing : 0);
    }

    if (totalWidth > WEEKS) {
      triggerToast('Text is too long to fit on 53 columns!', 'error');
      return;
    }

    // Determine horizontally centered position
    const startW = Math.floor((WEEKS - totalWidth) / 2);
    
    const newPixels: Record<string, number> = {};
    let currentW = startW;

    for (let i = 0; i < uppercase.length; i++) {
      const char = uppercase[i];
      const glyph = fontGlyphs[char] || fontGlyphs[' '];
      
      const charHeight = glyph.length;
      const charWidth = glyph[0].length;
      
      // Determine vertically centered position
      const startD = Math.floor((DAYS - charHeight) / 2);

      for (let row = 0; row < charHeight; row++) {
        const d = startD + row;
        for (let col = 0; col < charWidth; col++) {
          if (glyph[row][col] === 1) {
            const w = currentW + col;
            if (w >= 0 && w < WEEKS && d >= 0 && d < DAYS) {
              newPixels[`${w}_${d}`] = activeIntensity;
            }
          }
        }
      }
      currentW += charWidth + letterSpacing;
    }

    recordHistory(newPixels);
    triggerToast(`Applied text "${textInput}" to grid`, 'success');
  };
  
  // Emoji Stamp Applicator: stamps high-fidelity pixel emojis directly into the current layout
  const handleApplyEmojiToGrid = () => {
    const pattern = EMOJI_PATTERNS[selectedEmoji];
    if (!pattern) return;

    const emojiGrid = pattern.grid;
    const startW = stampColumnOffset;

    if (startW < 0 || startW + 7 > WEEKS) {
      triggerToast('Emoji placement exceeds the 53-week boundary!', 'error');
      return;
    }

    const nextPixels = { ...pixels };
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const val = emojiGrid[r][c];
        const targetW = startW + c;
        const targetD = r; // Map row to day (0-6)
        
        const key = `${targetW}_${targetD}`;
        if (val > 0) {
          nextPixels[key] = val;
        }
      }
    }

    setPixels(nextPixels);
    recordHistory(nextPixels);
    triggerToast(`Stamped "${pattern.name}" emoji ${pattern.visual} at week column ${startW}!`, 'success');
  };

  // Shift Pattern: nudge all painted pixels in up/down/left/right directions with wrapping boundaries
  const handleShiftGrid = (direction: 'up' | 'down' | 'left' | 'right') => {
    const nextPixels: Record<string, number> = {};
    
    Object.entries(pixels).forEach(([key, level]) => {
      if (!level) return;
      const [w, d] = key.split('_').map(Number);
      let newW = w;
      let newD = d;
      
      switch (direction) {
        case 'left':
          newW = (w - 1 + WEEKS) % WEEKS;
          break;
        case 'right':
          newW = (w + 1) % WEEKS;
          break;
        case 'up':
          newD = (d - 1 + DAYS) % DAYS;
          break;
        case 'down':
          newD = (d + 1) % DAYS;
          break;
      }
      nextPixels[`${newW}_${newD}`] = level as number;
    });
    
    setPixels(nextPixels);
    recordHistory(nextPixels);
    triggerToast(`Grid pattern shifted ${direction}`, 'success');
  };

  // Standard Smart Flood Fill engine
  const runSmartFloodFill = (startW: number, startD: number, targetLvl: number) => {
    const key = `${startW}_${startD}`;
    const startLvl = pixels[key] || 0;
    if (startLvl === targetLvl) return;

    const newPixels = { ...pixels };
    const queue: [number, number][] = [[startW, startD]];
    const visited = new Set<string>();
    visited.add(key);

    while (queue.length > 0) {
      const [w, d] = queue.shift()!;
      const curKey = `${w}_${d}`;
      
      if (targetLvl === 0) {
        delete newPixels[curKey];
      } else {
        newPixels[curKey] = targetLvl;
      }

      // Adjacents lookup (up, down, left, right)
      const directions = [
        [w + 1, d],
        [w - 1, d],
        [w, d + 1],
        [w, d - 1]
      ];

      for (const [nw, nd] of directions) {
        if (nw >= 0 && nw < WEEKS && nd >= 0 && nd < DAYS) {
          const adjKey = `${nw}_${nd}`;
          const adjLvl = pixels[adjKey] || 0;
          if (adjLvl === startLvl && !visited.has(adjKey)) {
            visited.add(adjKey);
            queue.push([nw, nd]);
          }
        }
      }
    }

    recordHistory(newPixels);
  };

  // Drawing Interaction handlers (MouseDown / MouseEnter for dragging support)
  const handleCellInteraction = (w: number, d: number, interaction: 'down' | 'enter') => {
    const coordKey = `${w}_${d}`;
    
    if (interaction === 'down') {
      setIsMouseDown(true);
      setDragStartPoint({ w, d });
      setDragEndPoint({ w, d });

      if (activeTool === 'brush') {
        const nextPixels = { ...pixels, [coordKey]: activeIntensity };
        recordHistory(nextPixels);
      } else if (activeTool === 'eraser') {
        const nextPixels = { ...pixels };
        delete nextPixels[coordKey];
        recordHistory(nextPixels);
      } else if (activeTool === 'fill') {
        runSmartFloodFill(w, d, activeIntensity);
      }
    } else if (interaction === 'enter' && isMouseDown) {
      setDragEndPoint({ w, d });

      if (activeTool === 'brush') {
        const nextPixels = { ...pixels, [coordKey]: activeIntensity };
        setPixels(nextPixels); // Update state directly while dragging, record history on up
      } else if (activeTool === 'eraser') {
        const nextPixels = { ...pixels };
        delete nextPixels[coordKey];
        setPixels(nextPixels);
      }
    }
  };

  // Conclude active drag operations
  const handleMouseUpGlobal = () => {
    if (!isMouseDown) return;
    setIsMouseDown(false);

    // Apply permanent shapes on Drag release
    if (activeTool === 'shape' && dragStartPoint && dragEndPoint) {
      const drawnPoints = getBresenhamPoints(
        dragStartPoint.w,
        dragStartPoint.d,
        dragEndPoint.w,
        dragEndPoint.d
      );

      const nextPixels = { ...pixels };
      drawnPoints.forEach(p => {
        const k = `${p.w}_${p.d}`;
        if (activeIntensity === 0) {
          delete nextPixels[k];
        } else {
          nextPixels[k] = activeIntensity;
        }
      });
      recordHistory(nextPixels);
    } else if (activeTool === 'brush' || activeTool === 'eraser') {
      // Record final stroke state in history
      recordHistory(pixels);
    }

    setDragStartPoint(null);
    setDragEndPoint(null);
  };

  // Keyboard shortcut config
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
        return;
      }
      // Undo command
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      // Redo command
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [pixels, undoStack, redoStack]);

  // Handle double clicking rename handler
  const handleRenameCommit = () => {
    setIsRenaming(false);
    if (!designName.endsWith('.json')) {
      setDesignName(prev => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed}.json` : 'Untitled_Design.json';
      });
    }
  };

  // Focus rename editor
  useEffect(() => {
    if (isRenaming && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isRenaming]);

  // Calculate stats values
  const countIntensity = (lvl: number) => {
    return Object.values(pixels).filter(val => (val as number) === lvl).length;
  };

  const countTotalActiveDays = Object.values(pixels).filter(val => (val as number) > 0).length;
  
  // Weights average calculation for Estimated commits
  const calculatedCommitsCount = 
    countIntensity(1) * 1.5 + 
    countIntensity(2) * 4 + 
    countIntensity(3) * 7 + 
    countIntensity(4) * 12;

  // Render color cells based on level and selected grid theme
  const getColorHex = (level: number) => {
    const theme = userSettings.gridTheme || 'github';
    switch (theme) {
      case 'slate':
        switch (level) {
          case 1: return '#1f2937';
          case 2: return '#4b5563';
          case 3: return '#9ca3af';
          case 4: return '#f3f4f6';
          default: return '#161B22';
        }
      case 'indigo':
        switch (level) {
          case 1: return '#1e1b4b';
          case 2: return '#3730a3';
          case 3: return '#6366f1';
          case 4: return '#a5b4fc';
          default: return '#161B22';
        }
      case 'amber':
        switch (level) {
          case 1: return '#451a03';
          case 2: return '#92400e';
          case 3: return '#d97706';
          case 4: return '#fcd34d';
          default: return '#161B22';
        }
      case 'crimson':
        switch (level) {
          case 1: return '#4c0519';
          case 2: return '#9f1239';
          case 3: return '#e11d48';
          case 4: return '#fda4af';
          default: return '#161B22';
        }
      case 'github':
      default:
        switch (level) {
          case 1: return '#0e4429'; // level 1 (emerald deep)
          case 2: return '#006d32'; // level 2 (green leaf)
          case 3: return '#26a641'; // level 3 (bright green)
          case 4: return '#39d353'; // level 4 (neon bright green)
          default: return '#161B22'; // empty
        }
    }
  };

  // Helper arrays for months & days rendering
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['Mon', 'Wed', 'Fri'];

  // Categories list
  const filterTags = ['All', 'Art', 'Logos', 'Text', 'Workflows'];

  // Filter gallery items
  const filteredGalleryItems = [...customGalleryItems, ...GALLERY_ITEMS].filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tag filter
    const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div 
      className="flex h-screen bg-[#0f1115] text-[#e5e7eb] font-sans overflow-hidden select-none"
      onMouseUp={handleMouseUpGlobal}
    >
      
      {/* Feedbacks Toast Announcer banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-[340px] z-[999] px-5 py-3 rounded-none border flex items-center gap-2.5 shadow-2xl backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-neutral-900 border-white/20 text-white' 
                : toast.type === 'error'
                ? 'bg-red-500/15 border-red-500/30 text-red-400'
                : 'bg-neutral-900 border-white/10 text-gray-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4.5 h-4.5 text-white shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0" />
            ) : (
              <Info className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            )}
            <span className="font-medium text-xs tracking-wider uppercase">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NEW FILE DIALOG ─── */}
      <AnimatePresence>
        {isNewFileDialogOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#121419] border border-white/10 rounded-none w-full max-w-lg p-6 md:p-8 flex flex-col gap-6 text-left shadow-2xl relative"
            >
              <div>
                <h3 className="text-lg font-serif italic text-white font-semibold">Initialize Contribution Workspace</h3>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mt-1">Configure a new workspace template schema file</p>
              </div>

              {/* Input for Filename */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#c7c4d7]">Workspace File Name</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-500 text-xs font-mono select-none">📁</span>
                  <input
                    type="text"
                    value={newFileTitle}
                    onChange={(e) => setNewFileTitle(e.target.value)}
                    placeholder="e.g. core_patch_00"
                    className="w-full bg-[#0f1115] border border-white/10 text-xs text-white pl-9 pr-14 py-3 rounded-none outline-none focus:border-white/30 transition-all font-mono"
                  />
                  <span className="absolute right-3 text-[10px] text-gray-500 font-mono font-bold select-none uppercase">.JSON</span>
                </div>
              </div>

              {/* Selector for Preset patterns */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#c7c4d7]">Initial Preset Pattern</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'blank', title: 'Blank Canvas', desc: 'Squeaky clean blank slate contributor matrix template', emoji: '🔲' },
                    { id: 'wave', title: 'Nebula Wave Flow', desc: 'Smooth horizontal sine wave vector pre-load pattern', emoji: '〰️' },
                    { id: 'starry', title: 'Cosmic Starfield', desc: 'Random clusters of scattered commit nodes on matrix', emoji: '🌌' },
                    { id: 'binary_checker', title: 'Binary Grid Check', desc: 'An elegant alternating check pattern on contributions', emoji: '🏁' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setNewPresetType(p.id)}
                      className={`p-3 border cursor-pointer hover:bg-white/5 transition-all flex flex-col gap-1 items-start text-left select-none relative ${
                        newPresetType === p.id 
                          ? 'border-[#39d353] bg-[#39d353]/5' 
                          : 'border-white/10 bg-[#0f1115]/50'
                      }`}
                    >
                      {newPresetType === p.id && (
                        <span className="absolute top-2 right-2 text-[10px] text-[#39d353] font-bold">● SELECTED</span>
                      )}
                      <span className="text-lg">{p.emoji}</span>
                      <span className="text-xs font-bold text-white font-sans mt-1">{p.title}</span>
                      <span className="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-2">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dialog controls */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFileDialogOpen(false)}
                  className="px-4 py-2.5 hover:bg-white/5 border border-transparent text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewFile}
                  className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Open Workspace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── PUBLISH TO COMMUNITY GALLERY DIALOG ─── */}
      <AnimatePresence>
        {isPublishToGalleryDialogOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#121419] border border-white/10 rounded-none w-full max-w-lg p-6 md:p-8 flex flex-col gap-6 text-left shadow-2xl relative"
            >
              <div>
                <h3 className="text-lg font-serif italic text-white font-semibold">Publish to Community Gallery</h3>
                <p className="text-[10px] text-[#39d353] font-mono uppercase tracking-wider mt-1">Publish & share your customized graph with fellow developers</p>
              </div>

              {/* HIGH FIDELITY EXPLANATORY SYSTEM: Save vs Publish DIFFERENCES */}
              <div className="grid grid-cols-2 gap-4 bg-[#0f1115] border border-white/5 p-4 rounded-none">
                <div className="flex flex-col gap-1 border-r border-white/5 pr-4 text-left">
                  <span className="text-white font-bold flex items-center gap-1.5 uppercase font-mono text-[9px] tracking-widest">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block"></span>
                    Save Draft (Private)
                  </span>
                  <span className="text-[10px] text-gray-400 leading-relaxed font-sans font-normal">
                    Saves current grids silently to browser <strong>localStorage</strong>. Private to you. Perfect for active drafts.
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[#39d353] font-bold flex items-center gap-1.5 uppercase font-mono text-[9px] tracking-widest-plus">
                    <span className="w-1.5 h-1.5 bg-[#39d353] rounded-full inline-block animate-pulse"></span>
                    Publish (Public feed)
                  </span>
                  <span className="text-[10px] text-gray-400 leading-relaxed font-sans font-normal">
                    Pushes template to global <strong>Community Gallery</strong>. Accessible to everyone for search & instantaneous remixing!
                  </span>
                </div>
              </div>

              {/* Title input field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#c7c4d7]">Template Design Title</label>
                <input
                  type="text"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  placeholder="e.g. SPARK ARCHITECTURE PATTERN"
                  className="w-full bg-[#0f1115] border border-white/10 text-xs text-white px-3.5 py-3 rounded-none outline-none focus:border-white/30 transition-all font-mono uppercase"
                />
              </div>

              {/* Author handle read-only badge */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#c7c4d7]">Publisher Handle</label>
                <div className="w-full bg-[#0f1115] border border-white/5 px-3.5 py-3 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-emerald-400 font-bold">@{userSession?.username || 'anonymous_coder'}</span>
                  <span className="text-[9px] text-gray-600 uppercase">Synchronized via Session</span>
                </div>
              </div>

              {/* Description template */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#c7c4d7]">Description Bio</label>
                <textarea
                  value={publishDescription}
                  onChange={(e) => setPublishDescription(e.target.value)}
                  rows={2}
                  maxLength={140}
                  placeholder="A beautiful contribution pattern generated using GitGraph Studio."
                  className="w-full bg-[#0f1115] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded-none outline-none focus:border-white/30 transition-all leading-relaxed font-sans"
                />
              </div>

              {/* Multiselect Tags selector selection */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#c7c4d7]">Tags Categorization (Select multiple)</label>
                <div className="flex gap-2 flex-wrap">
                  {['Art', 'Logos', 'Text', 'Workflows'].map((tag) => {
                    const isSelected = publishSelectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setPublishSelectedTags(prev => prev.filter(t => t !== tag));
                          } else {
                            setPublishSelectedTags(prev => [...prev, tag]);
                          }
                        }}
                        className={`px-3.5 py-1.5 border text-2xs uppercase tracking-wider font-semibold font-mono rounded-full transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#39d353]/15 border-[#39d353] text-[#39d353]' 
                            : 'bg-[#0f1115] border-white/10 text-[#c7c4d7] hover:border-white/30'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-[#0f1115] border border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                <span>Active cells to publish:</span>
                <span className="text-white font-semibold">
                  {Object.values(pixels).filter(v => (v as number) > 0).length} active nodes (weeks matrix)
                </span>
              </div>

              {/* Dialog controls */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5 mt-1">
                <button
                  type="button"
                  onClick={() => setIsPublishToGalleryDialogOpen(false)}
                  className="px-4 py-2.5 hover:bg-white/5 border border-transparent text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublishToGallery}
                  className="px-6 py-2.5 bg-[#39d353] hover:bg-[#2eab42] text-black text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(57,211,83,0.15)]"
                >
                  Publish Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER THE FULL SCREEN AUTHORIZATION PAGE IF ACTIVE TAB IS AUTH */}
      {activeTab === 'auth' ? (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center p-8 z-50 bg-[#0f1115] select-text">
          {/* Background Editorial Graphic Decorator skew element */}
          <div className="absolute top-0 right-0 w-[450px] h-full bg-[#16181f]/60 -skew-x-6 transform translate-x-32 z-0 border-l border-white/5 pointer-events-none" />
          
          {/* Elegant glowing cosmic background orb */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#a5b4fc]/5 rounded-full blur-3xl pointer-events-none" />

          <motion.div 
            key="auth"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-md w-full bg-[#121419]/95 border border-white/10 rounded-none p-8 shadow-2xl backdrop-blur relative flex flex-col gap-6 text-left"
          >
            {/* Visual Header */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#39d353] stroke-[1.5]" stroke="currentColor">
                  <rect x="2" y="2" width="7" height="7" rx="1" fill="#0e4429" stroke="#39d353" />
                  <rect x="15" y="2" width="7" height="7" rx="1" fill="#006d32" stroke="#26a641" />
                  <rect x="2" y="15" width="7" height="7" rx="1" fill="#26a641" stroke="#39d353" strokeDasharray="1 1" />
                  <circle cx="18" cy="18" r="3.5" fill="#39d353" />
                </svg>
              </div>
              <h2 className="text-xl font-serif italic text-white tracking-tight uppercase">Authorize Dev Workspace</h2>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-1">Configure profile handles and access grid templates</p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                
                const formEl = e.currentTarget;
                const userVal = (formEl.querySelector('#auth-username') as HTMLInputElement)?.value || 'developer';
                const emailVal = (formEl.querySelector('#auth-email') as HTMLInputElement)?.value || 'dev@gitgraph.ai';
                const nameVal = (formEl.querySelector('#auth-displayname') as HTMLInputElement)?.value || 'Active Developer';
                const avatarVal = (formEl.querySelector('[name="auth-avatar"]:checked') as HTMLInputElement)?.value || 
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

                setUserSession({
                  username: userVal.toLowerCase().replace(/\s+/g, ''),
                  email: emailVal,
                  name: nameVal,
                  bio: 'Enthusiastic grid compositor. Committed to beautiful graphs and clean visual branches.',
                  avatar: avatarVal,
                  isLoggedIn: true
                });

                triggerToast(`Welcome back, ${nameVal}! Session loaded.`, 'success');
                setActiveTab('editor');
              }}
              className="flex flex-col gap-4 text-left"
            >
              
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono">Username Handle</label>
                <input 
                  id="auth-username"
                  required
                  placeholder="e.g. hackercat"
                  type="text" 
                  defaultValue="hacker_prime"
                  className="w-full mt-1 bg-[#0f1115] border border-white/10 text-xs text-white px-3 py-2.5 rounded-none focus:outline-none focus:border-white/50 transition-all font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest text-[#a5b4fc] font-mono">Developer Email</label>
                <input 
                  id="auth-email"
                  required
                  placeholder="e.g. cats@coder.io"
                  type="email" 
                  defaultValue="hack@coder.io"
                  className="w-full mt-1 bg-[#0f1115] border border-white/10 text-xs text-white px-3 py-2.5 rounded-none focus:outline-none focus:border-white/50 transition-all font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest text-[#fda4af] font-mono">Profile Title Name</label>
                <input 
                  id="auth-displayname"
                  required
                  placeholder="e.g. Alex Rivera"
                  type="text" 
                  defaultValue="Alex Rivera"
                  className="w-full mt-1 bg-[#0f1115] border border-white/10 text-xs text-white px-3 py-2.5 rounded-none focus:outline-none focus:border-white/50 transition-all font-medium"
                />
              </div>

              {/* Fun Avatar Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono">Select Design Avatar</label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[
                    { val: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Tech Lead' },
                    { val: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', label: 'Design Architect' },
                    { val: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', label: 'Ecosystem Lead' },
                    { val: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Principal Fellow' }
                  ].map((avatarItem, animIdx) => (
                    <label key={animIdx} className="cursor-pointer relative group flex flex-col items-center">
                      <input 
                        type="radio" 
                        name="auth-avatar" 
                        value={avatarItem.val} 
                        defaultChecked={animIdx === 0}
                        className="sr-only peer"
                      />
                      <img 
                        referrerPolicy="no-referrer"
                        src={avatarItem.val} 
                        alt={avatarItem.label} 
                        className="w-12 h-12 rounded-full border-2 border-transparent object-cover shrink-0 peer-checked:border-white peer-checked:scale-105 transition-all opacity-80 group-hover:opacity-100"
                      />
                      <div className="text-[8px] text-gray-500 font-mono mt-1 text-center scale-90 peer-checked:text-white truncate w-full">{avatarItem.label}</div>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-none cursor-pointer"
              >
                Authenticate Workspace
              </button>

            </form>

            <div className="text-[10px] text-center text-gray-500 font-mono leading-relaxed px-4">
              Creates an encrypted local profile instance within your current web browser session space safely.
            </div>

            <button 
              type="button"
              onClick={() => {
                setActiveTab('editor');
                triggerToast('Using anonymous developer session', 'info');
              }}
              className="text-center text-[10px] text-gray-400 hover:text-white font-mono uppercase tracking-widest underline mt-1"
            >
              Cancel & Use Editor
            </button>

          </motion.div>
        </div>
      ) : null}

      {/* Mobile Drawer (Visible on Mobile only with AnimatePresence) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop cover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] md:hidden"
            />

            {/* Slide-out drawer menu block */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed left-0 top-0 h-full w-[280px] bg-[#121419] border-r border-[#39d353]/15 flex flex-col z-[101] backdrop-blur-xl md:hidden overflow-hidden"
            >
              {/* Drawer header segment */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0d0e12]">
                <div>
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#39d353] stroke-[1.5]" stroke="currentColor">
                      <rect x="2" y="2" width="7" height="7" rx="1" fill="#0e4429" stroke="#39d353" />
                      <rect x="15" y="2" width="7" height="7" rx="1" fill="#006d32" stroke="#26a641" />
                      <rect x="2" y="15" width="7" height="7" rx="1" fill="#26a641" stroke="#39d353" strokeDasharray="1 1" />
                      <circle cx="18" cy="18" r="3.5" fill="#39d353" />
                    </svg>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#39d353] font-bold font-mono">
                      Reimagined Pro
                    </span>
                  </div>
                  <div className="text-xl font-bold tracking-tighter uppercase italic font-serif text-white mt-1">
                    GitGraph <span className="font-extralight not-italic text-sm text-white/50 tracking-[0.1em]">Studio</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#39d353]"
                  aria-label="Close menu drawer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Navigation anchors links */}
              <div className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
                {[
                  { id: 'editor', label: 'Editor', icon: Edit3 },
                  { id: 'gallery', label: 'Gallery', icon: Grid3X3 },
                  { id: 'docs', label: 'Documentation', icon: FileText },
                  { id: 'templates', label: 'Templates', icon: GitBranch },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-none text-xs uppercase tracking-[0.15em] font-medium transition-all duration-200 text-left ${
                        activeTab === item.id
                          ? 'text-white bg-white/5 border-l-2 border-white font-bold'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Drawer footer controls settings user session */}
              <div className="p-4 border-t border-white/5 flex flex-col gap-1 px-3 text-left bg-[#0d0e12]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-none text-xs uppercase tracking-wider font-semibold transition-colors text-left w-full ${
                    activeTab === 'settings'
                      ? 'text-white bg-white/5 border-l-2 border-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const helpMsg = "GitGraph Studio v1.2.0 • For assistance, view our Documentation or reach out to support@gitgraph-studio.io.";
                    triggerToast(helpMsg, 'info');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3.5 px-4 py-2.5 rounded-none text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-left w-full"
                >
                  <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Support</span>
                </button>

                {/* Mobile session avatar details info */}
                <div
                  onClick={() => {
                    if (userSession.isLoggedIn) {
                      setActiveTab('profile');
                    } else {
                      setActiveTab('auth');
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`mt-4 p-3 bg-[#0f1115]/50 hover:bg-white/5 cursor-pointer border rounded-none flex items-center gap-3 transition-all ${
                    activeTab === 'profile' || activeTab === 'auth' ? 'border-white' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={userSession.isLoggedIn ? userSession.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt="user avatar"
                    className="w-8 h-8 rounded-full border border-white/15 scale-100 object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">
                      {userSession.isLoggedIn ? userSession.username : 'Anonymous'}
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium">
                      {userSession.isLoggedIn ? 'Developer Profile' : 'Click to Sign In'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SideNavBar Menu column for Desktop with Animating width and collapsible controls */}
      <motion.nav 
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="fixed left-0 top-0 h-full bg-[#121419]/98 border-r border-white/10 flex flex-col z-40 backdrop-blur-xl hidden md:flex overflow-hidden select-none"
      >
        <div className={`p-4 border-b border-white/10 flex flex-col gap-2 relative transition-all ${sidebarCollapsed ? 'items-center' : ''}`}>
          <div className="flex items-center justify-between w-full">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#39d353] stroke-[1.5]" stroke="currentColor">
                    <rect x="2" y="2" width="7" height="7" rx="1" fill="#0e4429" stroke="#39d353" />
                    <rect x="15" y="2" width="7" height="7" rx="1" fill="#006d32" stroke="#26a641" />
                    <rect x="2" y="15" width="7" height="7" rx="1" fill="#26a641" stroke="#39d353" strokeDasharray="1 1" />
                    <circle cx="18" cy="18" r="3.5" fill="#39d353" />
                  </svg>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#39d353] font-bold font-mono">
                    Reimagined Pro
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 rounded-none cursor-pointer transition-all hover:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#39d353]"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="p-1.5 text-gray-400 hover:text-[#39d353] hover:bg-[#39d353]/10 border border-white/5 rounded-none cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-[#39d353]"
                  aria-label="Expand sidebar"
                  title="Expand sidebar"
                >
                  <Menu className="w-4 h-4 text-[#39d353]" />
                </button>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="text-xl font-bold tracking-tighter uppercase italic font-serif text-white mt-1">
              GitGraph <span className="font-extralight not-italic text-sm text-white/50 tracking-[0.1em]">Studio</span>
            </div>
          )}
        </div>

        {/* Tab links wrapper */}
        <div className="flex-1 py-8 flex flex-col gap-1.5 px-3">
          {[
            { id: 'editor', label: 'Editor', icon: Edit3 },
            { id: 'gallery', label: 'Gallery', icon: Grid3X3 },
            { id: 'docs', label: 'Documentation', icon: FileText },
            { id: 'templates', label: 'Templates', icon: GitBranch },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                id={`${item.id}-tab-btn`}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center group relative gap-3.5 rounded-none text-xs uppercase tracking-[0.15em] font-medium transition-all duration-200 text-left ${
                  sidebarCollapsed ? 'justify-center w-11 h-11 mx-auto' : 'px-4 py-3.5 w-full'
                } ${
                  isActive 
                    ? 'text-white bg-white/5 border-l-2 border-white font-bold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                aria-label={`Go to ${item.label}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-[64px] bg-[#121419] border border-white/10 px-3 py-1.5 text-[10px] text-white uppercase tracking-wider font-mono shadow-2xl rounded-none opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info blocks */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-1.5 px-3 text-left">
          <button 
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center group relative gap-3.5 rounded-none text-xs uppercase tracking-wider font-semibold transition-colors text-left w-full ${
              sidebarCollapsed ? 'justify-center w-11 h-11 mx-auto' : 'px-4 py-2.5 w-full'
            } ${
              activeTab === 'settings' 
                ? 'text-white bg-white/5 border-l-2 border-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Go to settings"
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
            {sidebarCollapsed && (
              <div className="absolute left-[64px] bg-[#121419] border border-white/10 px-3 py-1.5 text-[10px] text-white uppercase tracking-wider font-mono shadow-2xl rounded-none opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-50">
                Settings
              </div>
            )}
          </button>
          
          <button 
            type="button"
            onClick={() => {
              const helpMsg = "GitGraph Studio v1.2.0 • For assistance, view our Documentation or reach out to support@gitgraph-studio.io.";
              triggerToast(helpMsg, 'info');
            }}
            className={`flex items-center group relative gap-3.5 rounded-none text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-left ${
              sidebarCollapsed ? 'justify-center w-11 h-11 mx-auto' : 'px-4 py-2.5 w-full'
            }`}
            aria-label="Get support assistance"
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-gray-400" />
            {!sidebarCollapsed && <span>Support</span>}
            {sidebarCollapsed && (
              <div className="absolute left-[64px] bg-[#121419] border border-white/10 px-3 py-1.5 text-[10px] text-white uppercase tracking-wider font-mono shadow-2xl rounded-none opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-50">
                Support Assistance
              </div>
            )}
          </button>

          {/* Dynamic Active User Profile Widget */}
          <div 
            onClick={() => {
              if (userSession.isLoggedIn) {
                setActiveTab('profile');
              } else {
                setActiveTab('auth');
              }
            }}
            className={`mt-4 bg-[#0f1115]/50 hover:bg-white/5 cursor-pointer border rounded-none flex items-center transition-all ${
              sidebarCollapsed ? 'justify-center w-11 h-11 mx-auto p-1' : 'p-3 gap-3 w-full'
            } ${
              activeTab === 'profile' || activeTab === 'auth' ? 'border-white' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <img 
              referrerPolicy="no-referrer"
              src={userSession.isLoggedIn ? userSession.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
              alt="user avatar" 
              className="w-8 h-8 rounded-full border border-white/15 scale-100 object-cover shrink-0"
            />
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {userSession.isLoggedIn ? userSession.username : 'Anonymous'}
                </div>
                <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                  {userSession.isLoggedIn ? 'Developer Profile' : 'Click to Sign In'}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main App Workspace Canvas with responsive collapsible margin padding */}
      <div className={`flex-1 transition-all duration-300 ${getMainPaddingLeft()} flex flex-col h-full bg-[#0f1115] relative overflow-hidden z-10`}>
        
        {/* Background Editorial Graphic Decorator skew element */}
        <div className="absolute top-0 right-0 w-[450px] h-full bg-[#16181f]/60 -skew-x-6 transform translate-x-32 z-0 border-l border-white/5 pointer-events-none" />

        {/* TopNavBar Header banner with hamburger menu toggle for responsive devices */}
        <header className="h-14 border-b border-white/10 bg-[#121419]/90 backdrop-blur-md flex justify-between items-center px-6 z-30 sticky top-0 shrink-0">
          {activeTab === 'editor' ? (
            <>
              <div className="flex items-center gap-4 z-10">
                {/* Mobile hamburger menu toggle */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-1.5 -ml-2 bg-[#161a22] border border-white/10 text-gray-400 hover:text-white rounded-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#39d353] shrink-0"
                  aria-label="Toggle sidebar menu"
                >
                  <Menu className="w-4 h-4" />
                </button>

                {/* Design Name Editor section */}
                <div className="flex items-center gap-2 group cursor-pointer py-1 px-2.5 hover:bg-white/5 rounded-none border border-transparent hover:border-white/5 transition-all">
                  <FileText className="w-4 h-4 text-gray-400" />
                  {isRenaming ? (
                    <input 
                      ref={nameInputRef}
                      type="text"
                      value={designName}
                      onChange={(e) => setDesignName(e.target.value)}
                      onBlur={handleRenameCommit}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameCommit()}
                      className="font-medium bg-[#0f1115] text-[#e5e7eb] border border-white/20 text-xs rounded-none px-2 py-0.5 outline-none w-48 font-mono"
                    />
                  ) : (
                    <div 
                      onDoubleClick={() => setIsRenaming(true)}
                      className="flex items-center gap-2 font-medium text-xs uppercase tracking-wider text-white"
                      title="Double click to rename"
                    >
                      <span>{designName}</span>
                      <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 text-gray-400 transition-all font-mono" />
                    </div>
                  )}
                </div>

                <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

                {/* Instant New File Creator Trigger */}
                <button 
                  onClick={() => {
                    setNewFileTitle('custom_release_patch');
                    setNewPresetType('blank');
                    setIsNewFileDialogOpen(true);
                  }}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-[#181d28]/80 hover:bg-white/5 border border-white/10 hover:border-white/20 text-[10px] uppercase font-mono tracking-wider font-semibold text-[#c7c4d7] hover:text-white transition-all rounded-none cursor-pointer hidden md:flex"
                  title="Open New File Workspace"
                >
                  <Plus className="w-3.5 h-3.5 text-[#39d353]" />
                  <span>New File</span>
                </button>

                <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

                {/* Undo Stack and Redo stack controls */}
                <div className="flex items-center gap-1.5">
                  <button 
                    id="undo-btn"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all rounded-none" 
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button 
                    id="redo-btn"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all rounded-none" 
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                  <button 
                    id="clear-btn"
                    onClick={handleClearGrid}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-white/5 transition-all rounded-none ml-1" 
                    title="Clear Grid Canvas"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Stats Scale and Actions */}
              <div className="flex items-center gap-3 z-10 flex-wrap">
                
                {/* Scale Zoom Controls */}
                <div className="flex items-center gap-2 text-gray-400 bg-[#0f1115] border border-white/10 rounded-none px-2.5 py-1 text-xs select-none">
                  <button onClick={handleZoomOut} className="hover:text-white transition-all" title="Zoom Out">
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[10px] font-semibold tracking-wider w-9 text-center" onDoubleClick={handleResetZoom} title="Double click to reset">
                    {zoomLevel}%
                  </span>
                  <button onClick={handleZoomIn} className="hover:text-white transition-all" title="Zoom In">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Local Workspace Cluster */}
                <div className="flex items-center gap-1.5 bg-[#161a22]/80 border border-white/10 p-1 rounded-none flex-wrap">
                  <span className="text-[8px] uppercase tracking-wider text-gray-500 font-mono font-bold px-1.5 select-none hidden md:inline">Draft:</span>
                  <button 
                    id="save-btn"
                    onClick={handleSaveDesign}
                    className="px-2.5 py-1 text-[10px] font-mono font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5 cursor-pointer rounded-none border border-white/5 bg-[#0f1115]/50"
                    title="Save current progress privately inside browser localStorage"
                  >
                    <Save className="w-3 h-3 text-gray-400" />
                    <span>Save</span>
                  </button>

                  <button 
                    id="export-btn"
                    onClick={handleExportJson}
                    className="px-2.5 py-1 text-[10px] font-mono font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer rounded-none border border-white/5 bg-[#0f1115]/50"
                    title="Download model.json file to local storage disk"
                  >
                    <Download className="w-3 h-3 text-gray-400 shrink-0" />
                    <span>Export</span>
                  </button>

                  <div className="h-3.5 w-[1px] bg-white/10 mx-0.5" />

                  <button 
                    onClick={() => {
                      const cleanTitle = designName.replace('.json', '').replace(/[_-]+/g, ' ').toUpperCase();
                      setPublishTitle(cleanTitle);
                      setPublishDescription('');
                      setIsPublishToGalleryDialogOpen(true);
                    }}
                    className="px-3.5 py-1 bg-[#39d353] text-[#0f1115] hover:bg-[#2eab42] font-semibold text-[10px] rounded-none font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(57,211,83,0.2)] hover:shadow-[0_0_20px_rgba(57,211,83,0.4)] border-none"
                    title="Publish current template to community gallery feed publicly"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#0f1115] stroke-[2.5]" />
                    <span>Publish</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full z-10 py-1">
              <div className="flex items-center gap-2">
                {/* Mobile hamburger menu toggle */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-1.5 -ml-2 bg-[#161a22] border border-white/10 text-gray-400 hover:text-white rounded-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#39d353] shrink-0 mr-2"
                  aria-label="Toggle sidebar menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono uppercase text-gray-400 tracking-[0.25em]">WORKSPACE</span>
                <span className="text-[10px] font-mono text-gray-600">/</span>
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-[0.25em] font-extrabold">{activeTab}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-gray-500 font-medium hidden sm:inline">Session state:</span>
                <span className={`text-[10px] font-mono py-0.5 px-2 rounded-none border font-bold ${
                  userSession.isLoggedIn 
                    ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' 
                    : 'border-red-500/20 text-red-400 bg-red-500/5'
                }`}>
                  {userSession.isLoggedIn ? 'AUTHORIZED' : 'ANONYMOUS'}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Dynamic viewport contents wrapper */}
        <div className="flex-1 overflow-hidden relative z-10">
          
          <AnimatePresence mode="wait">
            
            {/* EDITOR VIEW */}
            {activeTab === 'editor' && (
              <motion.div 
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex"
              >
                
                {/* TOOL PALETTE BAR COLUMN */}
                <div className="w-16 border-r border-white/10 bg-[#121419]/90 backdrop-blur flex flex-col items-center py-6 gap-4 shrink-0 justify-between z-10">
                  <div className="flex flex-col gap-2 w-full items-center">
                    <button 
                      id="tool-brush-btn"
                      onClick={() => { setActiveTool('brush'); triggerToast('Brush tool selected', 'info'); }}
                      className={`w-10 h-10 rounded-none flex items-center justify-center transition-all duration-200 ${
                        activeTool === 'brush' 
                          ? 'bg-white/10 text-white border-l-2 border-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Brush Tool (Paint grid level)"
                    >
                      <Paintbrush className="w-4.5 h-4.5" />
                    </button>

                    <button 
                      id="tool-eraser-btn"
                      onClick={() => { setActiveTool('eraser'); triggerToast('Eraser tool selected', 'info'); }}
                      className={`w-10 h-10 rounded-none flex items-center justify-center transition-all duration-200 ${
                        activeTool === 'eraser' 
                          ? 'bg-white/10 text-white border-l-2 border-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Eraser Tool (Clear grid cell)"
                    >
                      <Eraser className="w-4.5 h-4.5" />
                    </button>

                    <button 
                      id="tool-fill-btn"
                      onClick={() => { setActiveTool('fill'); triggerToast('Flood-Fill tool selected (clicks spill adjacent matching color)', 'info'); }}
                      className={`w-10 h-10 rounded-none flex items-center justify-center transition-all duration-200 ${
                        activeTool === 'fill' 
                          ? 'bg-white/10 text-white border-l-2 border-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Flood Fill Tool"
                    >
                      <PaintBucket className="w-4.5 h-4.5" />
                    </button>

                    <button 
                      id="tool-shape-btn"
                      onClick={() => { setActiveTool('shape'); triggerToast('Line Shape tool selected (drag line between cells)', 'info'); }}
                      className={`w-10 h-10 rounded-none flex items-center justify-center transition-all duration-200 ${
                        activeTool === 'shape' 
                          ? 'bg-white/10 text-white border-l-2 border-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Straight Line Tool"
                    >
                      <Square className="w-4.5 h-4.5" />
                    </button>

                    <div className="w-8 h-[1px] bg-white/10 my-1" />

                    {/* INTENSITY COLOR SWATCH PILES */}
                    <div className="flex flex-col gap-2.5 items-center mt-2">
                      <button 
                        onClick={() => setActiveIntensity(4)}
                        style={{ backgroundColor: getColorHex(4) }}
                        className={`w-5 h-5 rounded-none border transition-transform hover:scale-110 relative ${
                          activeIntensity === 4 ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent'
                        }`}
                        title="Level 4 Intensity (9+ commits)"
                      />
                      <button 
                        onClick={() => setActiveIntensity(3)}
                        style={{ backgroundColor: getColorHex(3) }}
                        className={`w-5 h-5 rounded-none border transition-transform hover:scale-110 relative ${
                          activeIntensity === 3 ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent'
                        }`}
                        title="Level 3 Intensity (6-8 commits)"
                      />
                      <button 
                        onClick={() => setActiveIntensity(2)}
                        style={{ backgroundColor: getColorHex(2) }}
                        className={`w-5 h-5 rounded-none border transition-transform hover:scale-110 relative ${
                          activeIntensity === 2 ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent'
                        }`}
                        title="Level 2 Intensity (3-5 commits)"
                      />
                      <button 
                        onClick={() => setActiveIntensity(1)}
                        style={{ backgroundColor: getColorHex(1) }}
                        className={`w-5 h-5 rounded-none border transition-transform hover:scale-110 relative ${
                          activeIntensity === 1 ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent'
                        }`}
                        title="Level 1 Intensity (1-2 commits)"
                      />
                      <button 
                        onClick={() => setActiveIntensity(0)}
                        style={{ backgroundColor: getColorHex(0) }}
                        className={`w-5 h-5 rounded-none border transition-transform hover:scale-110 relative ${
                          activeIntensity === 0 ? 'border-white scale-110 ring-2 ring-white/10' : 'border-transparent'
                        }`}
                        title="Level 0 Clean (no commits)"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-gray-500">
                    <Info className="w-4 h-4 hover:text-[#dae3ee] transition-all cursor-help" title="Click & drag to paint on the grid. Paint straight lines with Shape tool." />
                  </div>
                </div>

                {/* MAIN GRID BOARD CANVAS VIEWPORT */}
                <div className="flex-1 bg-transparent flex flex-col p-8 overflow-auto z-10">
                  
                  {/* Dynamic Scaling Grid Frame */}
                  <div 
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
                    className="m-auto bg-[#121419]/90 border border-white/10 rounded-none p-6 shadow-[0_24px_50px_rgba(0,0,0,0.5)] backdrop-blur-md transition-transform duration-200 z-10 min-w-max"
                  >
                    
                    {/* Months header tag with absolute offsets mapped precisely to starting weeks of each month */}
                    <div className="relative h-5 text-[10px] font-mono text-gray-400 mb-2.5 select-none uppercase tracking-[0.12em] font-semibold w-full">
                      {months.map((m, idx) => {
                        const startWeeks = [0, 4, 8, 13, 17, 21, 26, 30, 34, 39, 43, 47];
                        const startWeek = startWeeks[idx];
                        // 36px represents Mon/Wed/Fri row label width (w-7 is 28px) + gap-2 (8px)
                        // Each week represents 14px width + 4px gap = 18px total column width
                        const leftOffset = 36 + (startWeek * 18);
                        return (
                          <span 
                            key={idx} 
                            className="absolute text-left shrink-0"
                            style={{ left: `${leftOffset}px` }}
                          >
                            {m}
                          </span>
                        );
                      })}
                    </div>

                    {/* Left Days Label + Core Weeks Matrix container */}
                    <div className="flex gap-2">
                      
                      {/* Left vertical list of selected Days of week */}
                      <div className="flex flex-col font-mono text-[9px] text-gray-500 justify-between py-1.5 w-7 select-none uppercase tracking-wider">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                      </div>

                      {/* Main Contribution 53 Columns grid */}
                      <div className="flex gap-[4px]" id="contribution-grid">
                        {Array.from({ length: WEEKS }).map((_, w) => (
                          <div key={w} className="flex flex-col gap-[4px] shrink-0">
                            {Array.from({ length: DAYS }).map((_, d) => {
                              const key = `${w}_${d}`;
                              let level = pixels[key] || 0;

                              // Calculate preview modifications if dragging in straight shape mode
                              const isShapePreviewing = activeTool === 'shape' && isMouseDown && dragStartPoint && dragEndPoint;
                              if (isShapePreviewing) {
                                const shapePoints = getBresenhamPoints(
                                  dragStartPoint.w, 
                                  dragStartPoint.d, 
                                  dragEndPoint.w, 
                                  dragEndPoint.d
                                );
                                const isIncluded = shapePoints.some(pt => pt.w === w && pt.d === d);
                                if (isIncluded) {
                                  level = activeIntensity;
                                }
                              }

                              const cellColor = getColorHex(level);

                              return (
                                <div 
                                  key={d}
                                  onMouseDown={() => handleCellInteraction(w, d, 'down')}
                                  onMouseEnter={() => handleCellInteraction(w, d, 'enter')}
                                  style={{ backgroundColor: cellColor }}
                                  className={`w-3.5 h-3.5 rounded-none border hover:border-white hover:scale-110 cursor-crosshair transition-all duration-75 relative group ${
                                    userSettings.gridBorders ? 'border-white/[0.04]' : 'border-transparent'
                                  }`}
                                  title={`Week ${w + 1}, Day ${d === 0 ? 'Sunday' : d === 1 ? 'Monday' : d === 2 ? 'Tuesday' : d === 3 ? 'Wednesday' : d === 4 ? 'Thursday' : d === 5 ? 'Friday' : 'Saturday'}\nCommits: ${level === 4 ? '9+' : level === 3 ? '6-8' : level === 2 ? '3-5' : level === 1 ? '1-2' : '0'}`}
                                >
                                  {/* Micro tooltips on individual cells */}
                                  {userSettings.showTooltips && (
                                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black text-[#e5e7eb] border border-white/10 text-[10px] py-1 px-1.5 rounded-none hidden group-hover:block z-[999] whitespace-nowrap pointer-events-none font-mono">
                                      Col {w}, Row {d} • Lvl {level}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bounded Legend footer elements */}
                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/10 text-xs text-gray-400">
                      <a 
                        onClick={() => setActiveTab('docs')}
                        className="hover:text-white hover:underline font-medium text-white transition-all cursor-pointer flex items-center gap-1 font-serif italic"
                      >
                        Learn how we map contributions
                      </a>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px]">Less</span>
                        <div className="w-3 h-3 rounded-none border border-white/10" style={{ backgroundColor: getColorHex(0) }} />
                        <div className="w-3 h-3 rounded-none border border-white/10" style={{ backgroundColor: getColorHex(1) }} />
                        <div className="w-3 h-3 rounded-none border border-white/10" style={{ backgroundColor: getColorHex(2) }} />
                        <div className="w-3 h-3 rounded-none border border-white/10" style={{ backgroundColor: getColorHex(3) }} />
                        <div className="w-3 h-3 rounded-none border border-white/10" style={{ backgroundColor: getColorHex(4) }} />
                        <span className="font-mono text-[10px]">More</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* RIGHT PROPERTIES ADJUSTMENT PANEL SIDEBAR */}
                <aside className="w-[320px] bg-[#121419]/98 border-l border-white/10 flex flex-col z-20 shrink-0 overflow-y-auto">
                  <div className="p-4 border-b border-white/10 bg-[#121419] flex items-center justify-between">
                    <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-gray-500 stroke-1" />
                      <span>Properties</span>
                    </h2>
                  </div>

                  {/* Text Generator accordion section */}
                  <div className="border-b border-white/10">
                    <div 
                      onClick={() => setIsPropExpanded(!isPropExpanded)}
                      className="flex justify-between items-center p-4 hover:bg-white/5 cursor-pointer transition-colors select-none font-serif italic text-sm text-[#e5e7eb]"
                    >
                      <span>Text Generator</span>
                      <ChevronDown className={`w-4 h-4 text-[#c7c4d7] transition-transform duration-200 ${isPropExpanded ? '' : '-rotate-90'}`} />
                    </div>

                    {isPropExpanded && (
                      <div className="px-4 pb-5 flex flex-col gap-4 animate-fade-in">
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase font-mono tracking-wider">
                            Text Input
                          </label>
                          <input 
                            type="text" 
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            maxLength={12}
                            placeholder="HELLO"
                            className="w-full bg-[#161a22] border border-white/10 text-white text-xs px-3 py-2.5 rounded-none focus:border-white focus:outline-none focus:ring-0 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase font-mono tracking-wider">
                            Font Style
                          </label>
                          <select 
                            value={textFontStyle}
                            onChange={(e) => setTextFontStyle(e.target.value as FontStyle)}
                            className="w-full bg-[#161a22] border border-white/10 text-white text-xs px-3 py-2.5 rounded-none focus:border-white focus:outline-none appearance-none cursor-pointer font-sans uppercase tracking-widest text-[10px]"
                          >
                            <option value="5x7">5x7 Pixel (Standard)</option>
                            <option value="3x5">3x5 Compact</option>
                            <option value="blocky">Blocky Heavy</option>
                          </select>
                        </div>

                        <button 
                          onClick={handleApplyTextToGrid}
                          className="w-full px-4 py-2.5 bg-white text-black hover:bg-neutral-200 transition-all text-xs font-bold uppercase tracking-widest rounded-none flex items-center justify-center gap-2 mt-1 shadow-md border-none cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 text-black shrink-0 fill-black stroke-none" />
                          <span>Apply to Grid</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Emoji Stamper accordion section */}
                  <div className="border-b border-white/10 bg-[#121419]/50">
                    <div 
                      onClick={() => setIsEmojiExpanded(!isEmojiExpanded)}
                      className="flex justify-between items-center p-4 hover:bg-white/5 cursor-pointer transition-colors select-none font-serif italic text-sm text-[#e5e7eb]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#39d353]">✨</span>
                        <span>Emoji Stamper</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#c7c4d7] transition-transform duration-200 ${isEmojiExpanded ? '' : '-rotate-90'}`} />
                    </div>

                    {isEmojiExpanded && (
                      <div className="px-4 pb-5 flex flex-col gap-4 animate-fade-in text-left">
                        <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                          Select a high-fidelity contribution emoji template and align its start week columns using the slider below.
                        </p>

                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(EMOJI_PATTERNS).map(([key, item]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setSelectedEmoji(key)}
                              className={`p-2 flex flex-col items-center justify-center border transition-all rounded-none cursor-pointer ${
                                selectedEmoji === key
                                  ? 'border-white bg-white/10'
                                  : 'border-white/5 bg-[#0f1115]/50 hover:border-white/15'
                              }`}
                              title={item.name}
                            >
                              <span className="text-lg md:text-xl transform hover:scale-110 transition-transform">{item.visual}</span>
                              <span className="text-[7.5px] font-mono font-bold text-gray-400 text-center uppercase truncate w-full mt-0.5">{item.name.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">Start Week Offset</span>
                            <span className="text-[10px] text-[#39d353] font-mono font-bold">Col {stampColumnOffset}</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={46}
                            value={stampColumnOffset}
                            onChange={(e) => setStampColumnOffset(parseInt(e.target.value, 10))}
                            className="w-full accent-white bg-[#161a22] h-1 rounded-none cursor-pointer"
                          />
                          <div className="flex justify-between text-[8px] text-gray-500 font-mono mt-0.5">
                            <span>Left Wk 0</span>
                            <span>Middle</span>
                            <span>Right Wk 46</span>
                          </div>
                        </div>

                        <button
                          onClick={handleApplyEmojiToGrid}
                          className="w-full px-4 py-2.5 bg-white text-black hover:bg-neutral-200 transition-all text-xs font-bold uppercase tracking-widest rounded-none flex items-center justify-center gap-2 mt-1 shadow-md border-none cursor-pointer font-sans"
                        >
                          <span>Stamp {EMOJI_PATTERNS[selectedEmoji]?.visual} onto Grid</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pattern Shifter accordion section */}
                  <div className="border-b border-white/10 bg-[#121419]/50">
                    <div 
                      onClick={() => setIsShiftExpanded(!isShiftExpanded)}
                      className="flex justify-between items-center p-4 hover:bg-white/5 cursor-pointer transition-colors select-none font-serif italic text-sm text-[#e5e7eb]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#39d353]">✥</span>
                        <span>Pattern Shifter</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#c7c4d7] transition-transform duration-200 ${isShiftExpanded ? '' : '-rotate-90'}`} />
                    </div>

                    {isShiftExpanded && (
                      <div className="px-4 pb-5 flex flex-col gap-4 animate-fade-in text-left">
                        <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                          Shift/nudge the entire contribution pattern up, down, left, or right on the grid seamlessly.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-2">
                          {/* Row 1: Up */}
                          <button
                            onClick={() => handleShiftGrid('up')}
                            className="w-12 h-12 bg-[#0f1115]/80 border border-white/10 hover:border-white/30 text-white flex items-center justify-center font-bold text-lg select-none cursor-pointer transition-all hover:bg-white/5 rounded-none active:scale-95"
                            title="Shift Pattern Up"
                          >
                            ↑
                          </button>

                          {/* Row 2: Left, Down, Right */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleShiftGrid('left')}
                              className="w-12 h-12 bg-[#0f1115]/80 border border-white/10 hover:border-white/30 text-white flex items-center justify-center font-bold text-lg select-none cursor-pointer transition-all hover:bg-white/5 rounded-none active:scale-95"
                              title="Shift Pattern Left"
                            >
                              ←
                            </button>
                            <button
                              onClick={() => handleShiftGrid('down')}
                              className="w-12 h-12 bg-[#0f1115]/80 border border-white/10 hover:border-white/30 text-white flex items-center justify-center font-bold text-lg select-none cursor-pointer transition-all hover:bg-white/5 rounded-none active:scale-95"
                              title="Shift Pattern Down"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => handleShiftGrid('right')}
                              className="w-12 h-12 bg-[#0f1115]/80 border border-white/10 hover:border-white/30 text-white flex items-center justify-center font-bold text-lg select-none cursor-pointer transition-all hover:bg-white/5 rounded-none active:scale-95"
                              title="Shift Pattern Right"
                            >
                              →
                            </button>
                          </div>
                        </div>

                        {/* Quick Action Info Badge */}
                        <div className="text-[9px] text-gray-500 font-mono text-center">
                          Wrapping bounds active (53x7 torus mapping)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grid Canvas stats details dynamic info */}
                  <div className="border-b border-white/10 flex-1">
                    <div 
                      onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                      className="flex justify-between items-center p-4 hover:bg-white/5 cursor-pointer transition-colors select-none font-serif italic text-sm text-[#e5e7eb]"
                    >
                      <span>Stats</span>
                      <ChevronDown className={`w-4 h-4 text-[#c7c4d7] transition-transform duration-200 ${isStatsExpanded ? '' : '-rotate-90'}`} />
                    </div>

                    {isStatsExpanded && (
                      <div className="px-4 pb-5 grid grid-cols-2 gap-3 animate-fade-in">
                        <div className="bg-[#0f1115]/50 border border-white/10 rounded-none p-3.5 flex flex-col items-center justify-center text-center">
                          <span className="text-xl font-bold text-white tracking-tighter">
                            {countTotalActiveDays > 0 ? '365' : '0'}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.15em] font-semibold font-sans text-gray-500 mt-1">
                            Total Days
                          </span>
                        </div>

                        <div className="bg-[#0f1115]/50 border border-white/10 rounded-none p-3.5 flex flex-col items-center justify-center text-center">
                          <span className="text-xl font-bold text-white tracking-tighter">
                            {Math.round(calculatedCommitsCount)}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.15em] font-semibold font-sans text-gray-500 mt-1">
                            Est. Commits
                          </span>
                        </div>

                        {/* Intensity Breakdown Sub-chart lists */}
                        <div className="col-span-2 mt-2 bg-black/10 border border-white/5 rounded-none p-3 text-[11px] flex flex-col gap-2 font-mono text-gray-400">
                          <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Pixel densities tally:</div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-none bg-[#39d353] border border-white/5" />
                              <span>Level 4 (Bright)</span>
                            </div>
                            <span className="font-bold text-white font-mono">{countIntensity(4)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-none bg-[#26a641] border border-white/5" />
                              <span>Level 3 (Darker)</span>
                            </div>
                            <span className="font-bold text-white font-mono">{countIntensity(3)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-none bg-[#006d32] border border-white/5" />
                              <span>Level 2 (Medium)</span>
                            </div>
                            <span className="font-bold text-white font-mono">{countIntensity(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-none bg-[#0e4429] border border-white/5" />
                              <span>Level 1 (Subtle)</span>
                            </div>
                            <span className="font-bold text-white font-mono">{countIntensity(1)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </aside>

              </motion.div>
            )}

            {/* COMMUNITY GALLERY VIEW */}
            {activeTab === 'gallery' && (
              <motion.div 
                key="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full overflow-y-auto pb-16"
              >
                
                {/* Hero Search Section */}
                <section className="relative py-16 px-8 border-b border-[#30363D] bg-[#0D1117] overflow-hidden flex flex-col items-center justify-center text-center">
                  
                  {/* Subtle color highlight circles */}
                  <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                  
                  <h1 className="text-3xl font-extrabold text-[#dae3ee] tracking-tight mb-3 z-10 max-w-2xl">
                    Discover and remix community designs.
                  </h1>
                  <p className="text-sm text-[#c7c4d7]/70 max-w-lg mb-8 z-10 font-medium">
                    Explore high-fidelity git graphs, architectural diagrams, systems artwork, and procedural templates created by global developers.
                  </p>

                  <div className="w-full max-w-xl z-10 flex flex-col items-center gap-4">
                    
                    {/* Horizontal search query block */}
                    <div className="w-full relative rounded-xl border border-[#30363D] bg-[#010409] flex items-center py-2 px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                      <Search className="w-5 h-5 text-[#c7c4d7]/60 ml-1.5 mr-2" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search designs by title, tag, or author..."
                        className="bg-transparent border-none w-full text-sm text-[#dae3ee] placeholder-[#c7c4d7]/40 focus:outline-none focus:ring-0 mr-3"
                      />
                      <span className="bg-[#2d363e]/80 text-[#dae3ee] text-[10px] font-mono font-bold px-1.5 py-1 rounded select-none absolute right-3 block">
                        Cmd K
                      </span>
                    </div>

                    {/* Filter Tag filters */}
                    <div className="flex gap-2 flex-wrap justify-center">
                      {filterTags.map(tag => (
                        <button 
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border transition-all ${
                            selectedTag === tag 
                              ? 'bg-primary/20 border-primary text-primary' 
                              : 'bg-[#182028] border-[#30363D] text-[#c7c4d7]/80 hover:border-primary/50 hover:text-primary'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Grid card gallery cards lists */}
                <section className="p-8 max-w-7xl mx-auto w-full">
                  <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#30363D]/40">
                    <div className="flex gap-4 font-semibold text-sm">
                      {['Trending', 'Latest', 'Featured'].map(category => (
                        <button 
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`pb-3 -mb-[15px] transition-all ${
                            selectedCategory === category 
                              ? 'text-primary border-b-2 border-primary' 
                              : 'text-[#c7c4d7]/70 hover:text-[#dae3ee]'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-[#c7c4d7]/50 font-mono">
                      Showing {filteredGalleryItems.length} templates
                    </span>
                  </div>

                  {filteredGalleryItems.length === 0 ? (
                    <div className="text-center py-16 text-[#c7c4d7]/50 font-medium font-mono">
                      No matching community design templates found matching query
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGalleryItems.map(item => (
                        <div 
                          key={item.id}
                          className="group border border-[#30363D] rounded-xl bg-[#0D1117] overflow-hidden hover:border-primary/50 transition-all cursor-pointer flex flex-col h-full shadow-md"
                        >
                          {/* Image preview space */}
                          <div className="h-44 w-full bg-[#010409] relative overflow-hidden border-b border-[#30363D] flex items-center justify-center">
                            {item.imageUrl ? (
                              <img 
                                referrerPolicy="no-referrer"
                                src={item.imageUrl} 
                                alt={item.title}
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                              />
                            ) : (
                              // Fallback Vector Template visualizer block
                              <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-tr from-[#010409] to-[#161B22] group-hover:from-[#110e24] group-hover:to-[#161b22]">
                                <GitBranch className="w-14 h-14 text-[#30363D]/80 group-hover:text-primary/70 transition-colors duration-300" strokeWidth={1} />
                                <div className="absolute top-3 left-3 flex gap-1">
                                  <span className="bg-[#2d363e] border border-[#464554]/30 text-[#dae3ee] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                                    Template
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Mask overlay remix trigger link */}
                            <div className="absolute inset-0 bg-[#010409]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleLoadItem(item); }}
                                className="px-4 py-2 bg-[#6366F1] text-xs font-bold rounded shadow-lg text-white glow-button flex items-center gap-2"
                              >
                                <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                                <span>Remix in Editor</span>
                              </button>
                            </div>
                          </div>

                          {/* Content Detail info */}
                          <div className="p-5 flex flex-col flex-grow">
                            <div className="flex gap-1.5 flex-wrap mb-2.5">
                              {item.tags.map(t => (
                                <span key={t} className="bg-[#2d363e]/40 text-[#c7c4d7]/70 text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                                  {t}
                                </span>
                              ))}
                            </div>

                            <h3 className="font-bold text-base text-[#dae3ee] mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#c7c4d7]/60 leading-relaxed mb-4 line-clamp-2">
                              {item.description || "Fully customized commit layout designed with GitGraph Studio."}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#30363D]/30">
                              <div className="flex items-center gap-2">
                                <img 
                                  referrerPolicy="no-referrer"
                                  src={item.authorAvatar} 
                                  alt={item.author}
                                  className="w-5.5 h-5.5 rounded-full border border-[#30363D] object-cover"
                                />
                                <span className="text-xs font-mono text-[#c7c4d7] font-semibold">@{item.author}</span>
                              </div>

                              <div className="flex items-center gap-2.5 font-mono text-[10px] text-[#c7c4d7]/60">
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3.5 h-3.5 fill-red-500/10 text-red-400" />
                                  <span>{item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}k` : item.likes}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="w-3.5 h-3.5 text-primary" />
                                  <span>{item.downloads >= 1000 ? `${(item.downloads / 1000).toFixed(1)}k` : item.downloads}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              </motion.div>
            )}

            {/* DOCUMENTATION VIEW */}
            {activeTab === 'docs' && (
              <motion.div 
                key="docs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full overflow-y-auto pb-16"
              >
                
                <div className="max-w-4xl mx-auto w-full px-8 py-12">
                  <div className="mb-10 pb-5 border-b border-[#30363D]">
                    <h1 className="text-3xl font-extrabold text-[#dae3ee] tracking-tight mb-2.5">
                      GitGraph Studio Guide
                    </h1>
                    <p className="text-base text-[#c7c4d7] font-medium leading-relaxed">
                      Follow this step-by-step developer tutorial to design, generate, and completely automate custom commit artworks on your GitHub profile.
                    </p>
                  </div>

                  <div className="markdown-content">
                    
                    <section className="mb-12" id="designing">
                      <h2>1. Designing your graph</h2>
                      <p>
                        Get started directly inside the <strong>Editor</strong> workspace. The grid panel represents a single, complete year of contribution archives totaling 53 columns (weeks) and 7 rows (days, with Sunday running across the top-most row).
                      </p>
                      
                      <ul>
                        <li>Choose custom paint instruments (Brush, Eraser, Flood Fill, Shape lines) to lay cells.</li>
                        <li>Toggle between Level 1 (faint emerald) to Level 4 (solid bright green) colors in the swatch controller.</li>
                        <li>Open the **Text Generator** tool in the inspector to write custom vector words centered on the canvas panel.</li>
                      </ul>

                      <div className="bg-[#161B22]/50 border border-[#30363D] rounded-lg p-4 flex items-start gap-4.5 mt-5">
                        <Lightbulb className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-sm text-[#dae3ee] font-bold mb-1">Pro Tip</strong>
                          <span className="text-xs text-[#c7c4d7] leading-relaxed">
                            Check out standard shapes and precompiled arrangements in the <strong>Gallery</strong> or <strong>Templates</strong> tabs to trigger automatic loading ideas.
                          </span>
                        </div>
                      </div>
                    </section>

                    <section className="mb-12" id="exporting">
                      <h2>2. Exporting design.json</h2>
                      <p>
                        Once your design is ready, download the raw coordinates layout configuration model to connect it with GitHub action variables:
                      </p>

                      <ol className="list-decimal pl-6 space-y-2 text-sm text-[#c7c4d7] mb-5">
                        <li>Rename your file using the double click field in the header.</li>
                        <li>Click the high-contrast <strong>Export design.json</strong> button in the top menu.</li>
                        <li>Move this file inside your local computer workspace. It holds precise coordinates conforming to standard schemes.</li>
                      </ol>

                      {/* Code visual block conforming exactly to the screens docs */}
                      <pre>
                        <code>
{`{
  "version": "1.0",
  "name": "My Awesome Design",
  "dimensions": { "weeks": 53, "days": 7 },
  "pixels": [
    { "w": 0, "d": 3, "level": 4 },
    { "w": 1, "d": 2, "level": 3 }
  ]
}`}
                        </code>
                      </pre>
                    </section>

                    <section className="mb-12" id="setup">
                      <h2>3. Setting up the GitHub Repository</h2>
                      <p>
                        Initialize a dedicated repository matching the name <code>github-art-runner</code> to preserve backdated commits without polluting normal works.
                      </p>

                      <div className="bg-[#2c0051]/20 border border-[#b76dff]/40 rounded-lg p-4 flex items-start gap-4.5 mb-6">
                        <AlertTriangle className="w-5 h-5 text-[#b76dff] mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-sm text-[#dae3ee] font-bold mb-1">Important Profile Setting</strong>
                          <span className="text-xs text-[#c7c4d7] leading-relaxed">
                            Make sure your GitHub Account profile settings has **"Include private contributions on my profile"** marked checked if your repository is set private, otherwise the public graph will remain clear!
                          </span>
                        </div>
                      </div>

                      <ul>
                        <li>Create a fresh, empty public or private repository.</li>
                        <li>Add the copied <code>design.json</code> coordinate files at the root of the repo.</li>
                        <li>Commit the workflow structure described next.</li>
                      </ul>
                    </section>

                    <section className="mb-12" id="running">
                      <h2>4. Running the Workflow</h2>
                      <p>
                        Create a file at <code>.github/workflows/draw-graph.yml</code> in your repository and copy the workflow block configuration coordinates:
                      </p>

                      <pre>
                        <code>
{`name: Draw GitHub Graph

on:
  workflow_dispatch:
  push:
    paths:
      - 'design.json'

jobs:
  draw:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run GitGraph Studio Action
        uses: gitgraph-studio/draw-action@v1
        with:
          design_file: 'design.json'
          github_token: \${{ secrets.GITHUB_TOKEN }}
          commit_email: 'your-email@users.noreply.github.com'`}
                        </code>
                      </pre>

                      <p>
                        Push changes, visit your repository's <strong>Actions</strong> manager tab list, highlight "Draw GitHub Graph", and select the trigger input button <strong>Run workflow</strong>!
                      </p>
                    </section>

                  </div>
                </div>

              </motion.div>
            )}

            {/* AUTOMATION PIPELINE TEMPLATES VIEW */}
            {activeTab === 'templates' && (
              <motion.div 
                key="templates"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full overflow-y-auto pb-16"
              >
                
                <div className="max-w-7xl mx-auto w-full px-8 py-16 flex flex-col gap-12">
                  
                  {/* Hero headers */}
                  <section className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-[#30363D] bg-[#060f16] text-secondary text-xs uppercase font-mono font-bold mb-4 tracking-wide shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                      <span>Open Source Template</span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-extrabold text-[#dae3ee] mb-4 tracking-tight max-w-3xl leading-tight">
                      Automate your profile art in <span className="text-primary tracking-wide">3 steps.</span>
                    </h1>
                    <p className="text-base lg:text-lg text-[#c7c4d7]/80 max-w-2xl mb-8 leading-relaxed font-medium">
                      A developer-centric framework tool to programmatically paint and deploy gorgeous landing graphs directly via secure GitHub Actions. Zero OAuth logins needed with complete local ownership.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button 
                        onClick={() => {
                          const codeText = ".github/workflows/generate.yml";
                          navigator.clipboard.writeText(codeText);
                          triggerToast('Copied actions reference link!', 'success');
                        }}
                        className="px-6 py-2.5 bg-[#6366F1] text-sm font-bold rounded shadow-lg text-white glow-button flex items-center gap-2"
                      >
                        <Code className="w-4 h-4 text-white shrink-0" />
                        <span>Use This Template</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('docs')}
                        className="px-6 py-2.5 border border-[#30363D] text-sm font-bold rounded text-[#dae3ee] hover:bg-[#161B22] hover:border-primary/40 transition-all flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-[#c7c4d7] shrink-0" />
                        <span>Read Docs</span>
                      </button>
                    </div>
                  </section>

                  {/* Bento Grid layout workflow display */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                    
                    {/* Left workflow file mock block */}
                    <div className="lg:col-span-7 bg-[#060f16] border border-[#30363D] rounded-xl overflow-hidden flex flex-col shadow-xl">
                      <div className="bg-[#161B22] border-b border-[#30363D] px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Code className="w-4 h-4 text-[#c7c4d7]/70" />
                          <span className="font-mono text-xs text-[#c7c4d7]/80 font-semibold">.github/workflows/generate.yml</span>
                        </div>
                        <button 
                          onClick={() => {
                            const yamlCode = `name: Generate Profile Art\n\non:\n  schedule:\n    - cron: '0 0 * * *'\n  workflow_dispatch:\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: gitgraph-studio/generate@v1\n        with:\n          config: config.json\n          output: dist/profile.svg`;
                            navigator.clipboard.writeText(yamlCode);
                            triggerToast('YAML configuration block copied!', 'success');
                          }}
                          className="p-1 px-2.5 hover:bg-[#2d363e]/70 border border-[#30363D]/60 rounded text-[11px] font-mono font-bold text-[#c7c4d7] flex items-center gap-1.5 transition-all outline-none"
                        >
                          <Copy className="w-3 h-3 text-[#c7c4d7]" />
                          <span>Copy</span>
                        </button>
                      </div>

                      <div className="p-5 bg-[#010409] flex-grow">
                        <pre className="font-mono text-[13px] text-[#c7c4d7]/90 overflow-x-auto whitespace-pre leading-relaxed select-text">
{`name: Generate Profile Art

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: gitgraph-studio/generate@v1
        with:
          config: config.json
          output: dist/profile.svg`}
                        </pre>
                      </div>
                    </div>

                    {/* Right interactive flowchart diagram connector */}
                    <div className="lg:col-span-5 bg-[#060f16] border border-[#30363D] rounded-xl overflow-hidden flex flex-col shadow-xl">
                      <div className="bg-[#161B22] border-b border-[#30363D] px-4 py-3 flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-[#c7c4d7]/70" />
                        <span className="font-mono text-xs text-[#c7c4d7]/80 font-semibold">Pipeline</span>
                      </div>

                      {/* Vertically Aligned Step Flow Connector blocks */}
                      <div className="p-6 flex-grow flex flex-col justify-center items-center bg-[#010409] relative gap-4 max-w-sm mx-auto w-full">
                        
                        {/* Step 1 card */}
                        <div className="w-full flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-[#30363D] bg-[#161B22] flex items-center justify-center text-primary shadow shrink-0">
                            <span className="font-mono font-bold text-sm">1</span>
                          </div>
                          <div className="flex-1 bg-[#161B22] border border-[#30363D] p-3 rounded-lg text-center font-mono font-semibold text-xs text-[#dae3ee] shadow-sm">
                            Upload Raw json
                          </div>
                        </div>

                        <div className="h-6 border-l-2 border-dashed border-[#30363D] animate-pulse" />

                        {/* Step 2 card */}
                        <div className="w-full flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-[#30363D] bg-[#161B22] flex items-center justify-center text-secondary shadow shrink-0">
                            <span className="font-mono font-bold text-sm">2</span>
                          </div>
                          <div className="flex-1 bg-[#161B22] border border-[#26a641]/30 p-3 rounded-lg text-center font-mono font-semibold text-xs text-secondary shadow-sm">
                            GitHub Action Runner
                          </div>
                        </div>

                        <div className="h-6 border-l-2 border-dashed border-[#30363D] animate-pulse" />

                        {/* Step 3 card */}
                        <div className="w-full flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-[#30363D] bg-[#161B22] flex items-center justify-center text-secondary shrink-0 shadow">
                            <span className="font-mono font-bold text-sm">3</span>
                          </div>
                          <div className="flex-1 bg-[#161B22] border border-[#30363D] p-3 rounded-lg text-center font-mono font-semibold text-xs text-[#dae3ee] shadow-sm">
                            Profile Art Updated
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Feature lists row */}
                  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    
                    <div className="bg-[#060f16] border border-[#30363D] rounded-xl p-6 hover:bg-[#161B22]/60 transition-colors shadow-lg">
                      <div className="w-12 h-12 rounded-lg border border-[#30363D] bg-[#010409] flex items-center justify-center text-primary mb-4 shadow">
                        <FolderLock className="w-6 h-6 text-primary fill-primary/10" />
                      </div>
                      <h3 className="font-bold text-lg text-on-surface mb-2">No OAuth Required</h3>
                      <p className="text-xs text-[#c7c4d7]/70 leading-relaxed font-medium">
                        Runs completely within your repository space. No credentials mapping, OAuth access tokens, or third-party scopes requested.
                      </p>
                    </div>

                    <div className="bg-[#060f16] border border-[#30363D] rounded-xl p-6 hover:bg-[#161B22]/60 transition-colors shadow-lg">
                      <div className="w-12 h-12 rounded-lg border border-[#30363D] bg-[#010409] flex items-center justify-center text-secondary mb-4 shadow">
                        <Sparkles className="w-6 h-6 text-secondary fill-secondary/10 font-bold" />
                      </div>
                      <h3 className="font-bold text-lg text-on-surface mb-2">Action Ecosystem</h3>
                      <p className="text-xs text-[#c7c4d7]/70 leading-relaxed font-medium">
                        Leverages standard GitHub actions virtual runners safely. Run schedules on fixed intervals or trigger manual workflows on click.
                      </p>
                    </div>

                    <div className="bg-[#060f16] border border-[#30363D] rounded-xl p-6 hover:bg-[#161B22]/60 transition-colors shadow-lg">
                      <div className="w-12 h-12 rounded-lg border border-[#30363D] bg-[#010409] flex items-center justify-center text-[#c0c1ff] mb-4 shadow">
                        <Code className="w-6 h-6 text-[#c0c1ff]" />
                      </div>
                      <h3 className="font-bold text-lg text-on-surface mb-2">Perfect Ownership</h3>
                      <p className="text-xs text-[#c7c4d7]/70 leading-relaxed font-medium">
                        Fork our runner coordinates, configure custom branches, and let commit art display uniquely on your primary landing cards.
                      </p>
                    </div>

                  </section>

                </div>

              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-full flex flex-col p-8 overflow-y-auto z-10"
              >
                <div className="max-w-4xl w-full mx-auto flex flex-col gap-8 pb-16">
                  
                  {/* Page Header */}
                  <div>
                    <h1 className="text-3xl font-serif italic text-white tracking-tight">System Settings</h1>
                    <p className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Configure your editor canvas & system layout variables</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Visual Canvas Theme Setting */}
                    <div className="bg-[#121419]/90 border border-white/10 rounded-none p-6 flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                        <Sliders className="w-4.5 h-4.5 text-gray-400" />
                        <h2 className="text-sm font-bold tracking-wider uppercase text-white">Visual Grid Palette</h2>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Select a coordinate theme to color-map contribution cell levels instantly. This dynamically styles the workspace editor, palettes, and exported assets.
                      </p>

                      <div className="flex flex-col gap-2 mt-2">
                        {[
                          { id: 'github', name: 'Emerald Classic (GitHub)', desc: 'The nostalgic open-source development green', colors: ['#0e4429', '#006d32', '#26a641', '#39d353'] },
                          { id: 'slate', name: 'Slate Monochrome', desc: 'Symmetrical gray values for minimalist layouts', colors: ['#1f2937', '#4b5563', '#9ca3af', '#f3f4f6'] },
                          { id: 'indigo', name: 'Cyber Indigo', desc: 'Futuristic ultraviolet neon shades', colors: ['#1e1b4b', '#3730a3', '#6366f1', '#a5b4fc'] },
                          { id: 'amber', name: 'Amber Sunset', desc: 'Warm golden autumn tone values', colors: ['#451a03', '#92400e', '#d97706', '#fcd34d'] },
                          { id: 'crimson', name: 'Crimson Power', desc: 'Intense luxury red shades', colors: ['#4c0519', '#9f1239', '#e11d48', '#fda4af'] },
                        ].map((themeOpt) => (
                          <button
                            key={themeOpt.id}
                            onClick={() => {
                              setUserSettings(prev => ({ ...prev, gridTheme: themeOpt.id as any }));
                              triggerToast(`Theme initialized: ${themeOpt.name}`, 'success');
                            }}
                            className={`w-full p-3 text-left border flex items-center justify-between transition-all rounded-none cursor-pointer ${
                              userSettings.gridTheme === themeOpt.id 
                                ? 'border-white bg-white/5' 
                                : 'border-white/5 bg-[#0f1115]/55 hover:border-white/15'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-2">
                                {themeOpt.name}
                                {userSettings.gridTheme === themeOpt.id && (
                                  <span className="text-[9px] bg-white text-black px-1 py-0.5 rounded-none font-mono font-extrabold select-none">ACTIVE</span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-500 mt-0.5 font-medium">{themeOpt.desc}</div>
                            </div>
                            <div className="flex gap-1">
                              {themeOpt.colors.map((col, idx) => (
                                <div key={idx} className="w-3 h-3 rounded-none" style={{ backgroundColor: col }} />
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Behavior Variables */}
                    <div className="flex flex-col gap-6 text-left">
                      
                      {/* Editor Preferences */}
                      <div className="bg-[#121419]/90 border border-white/10 rounded-none p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                          <Settings className="w-4.5 h-4.5 text-gray-400" />
                          <h2 className="text-sm font-bold tracking-wider uppercase text-white">Grid Interactivity</h2>
                        </div>

                        {/* Border toggle */}
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <div>
                            <div className="text-xs font-bold text-white">Visual Grid Borders</div>
                            <div className="text-[10px] text-gray-500 font-medium">Draw fine divider outlines between individual grid cells.</div>
                          </div>
                          <button
                            onClick={() => {
                              setUserSettings(prev => ({ ...prev, gridBorders: !prev.gridBorders }));
                              triggerToast(`Grid borders ${!userSettings.gridBorders ? 'enabled' : 'disabled'}`, 'info');
                            }}
                            className={`px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest rounded-none cursor-pointer transition-all ${
                              userSettings.gridBorders 
                                ? 'bg-white text-black hover:bg-neutral-200' 
                                : 'border border-white/10 text-gray-400 hover:border-white/35'
                            }`}
                          >
                            {userSettings.gridBorders ? 'ACTIVE' : 'MUTED'}
                          </button>
                        </div>

                        {/* Tooltip toggle */}
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <div>
                            <div className="text-xs font-bold text-white">Hover Row/Col Tooltips</div>
                            <div className="text-[10px] text-gray-500 font-medium">Show live coordinates and index positions on cell hover.</div>
                          </div>
                          <button
                            onClick={() => {
                              setUserSettings(prev => ({ ...prev, showTooltips: !prev.showTooltips }));
                              triggerToast(`Tooltips ${!userSettings.showTooltips ? 'enabled' : 'disabled'}`, 'info');
                            }}
                            className={`px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest rounded-none cursor-pointer transition-all ${
                              userSettings.showTooltips 
                                ? 'bg-white text-black hover:bg-neutral-200' 
                                : 'border border-white/10 text-gray-400 hover:border-white/35'
                            }`}
                          >
                            {userSettings.showTooltips ? 'ACTIVE' : 'MUTED'}
                          </button>
                        </div>

                        {/* Default intensity slider */}
                        <div className="py-2">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-bold text-white">Default Splash Intensity</span>
                            <span className="font-mono text-[10px] text-[#fcd34d]">Level {userSettings.defaultIntensity}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium mb-3">Pre-selected drawing level used when initializing templates or grid injections.</p>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4].map((intensityVal) => (
                              <button
                                key={intensityVal}
                                onClick={() => {
                                  setUserSettings(prev => ({ ...prev, defaultIntensity: intensityVal }));
                                  triggerToast(`Default drawing level set to Lvl ${intensityVal}`, 'info');
                                }}
                                style={{ backgroundColor: getColorHex(intensityVal) }}
                                className={`flex-1 py-1 px-2 font-mono text-[10px] text-center border font-bold transition-all rounded-none cursor-pointer ${
                                  userSettings.defaultIntensity === intensityVal 
                                    ? 'border-white text-white font-extrabold ring-2 ring-white/15'
                                    : 'border-transparent text-black/50 hover:text-white/80'
                                }`}
                              >
                                Lvl {intensityVal}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Hard Reset Card */}
                      <div className="bg-red-950/15 border border-red-500/20 rounded-none p-6 flex flex-col gap-4">
                        <div>
                          <div className="text-xs font-bold text-red-500 uppercase tracking-widest">Ecosystem Hard Reset</div>
                          <p className="text-[10px] text-gray-400 leading-relaxed mt-1">
                            Careful! Purge all local storage attributes. This erases user preferences, session profiles, system settings, and deleted saved canvas designs permanently.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm("Warning: This clears all progress, layouts, and profile configurations permanently. Proceed?")) {
                              localStorage.clear();
                              triggerToast('Ecosystem successfully wiped clean. Reloading...', 'success');
                              setTimeout(() => {
                                window.location.reload();
                              }, 1200);
                            }
                          }}
                          className="px-4 py-2 border border-red-500/30 text-red-400 text-[10px] tracking-wider uppercase font-bold rounded-none hover:bg-red-500/10 transition-colors text-center font-mono cursor-pointer"
                        >
                          Purge Session Data
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-full flex flex-col p-8 overflow-y-auto z-10"
              >
                <div className="max-w-4xl w-full mx-auto flex flex-col gap-8 pb-16 text-left">
                  
                  {/* Page Header */}
                  <div>
                    <h1 className="text-3xl font-serif italic text-white tracking-tight">System Identity</h1>
                    <p className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Manage credentials, view records, catalog coordinates</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Panel: Profile Management */}
                    <div className="md:col-span-1 flex flex-col gap-6">
                      <div className="bg-[#121419]/90 border border-white/10 rounded-none p-6 flex flex-col items-center text-center gap-4">
                        <div className="relative group">
                          <img 
                            referrerPolicy="no-referrer"
                            src={userSession.avatar}
                            alt="author avatar"
                            className="w-24 h-24 rounded-full border border-white/15 object-cover shrink-0 shadow-lg"
                          />
                        </div>

                        <div className="w-full">
                          <div className="text-sm font-bold text-white uppercase tracking-wider">{userSession.name}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">@{userSession.username}</div>
                        </div>

                        <div className="w-full text-xs text-gray-400 italic font-serif py-2 border-y border-white/5 leading-relaxed font-light">
                          "{userSession.bio || 'Empty bio prompt. Paint a contribution landscape to motivate workflow developers!'}"
                        </div>

                        <div className="w-full flex flex-col gap-2.5 text-left mt-2">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Email Address</span>
                            <div className="text-xs text-gray-300 font-medium truncate mt-0.5">{userSession.email}</div>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setUserSession({
                              username: '',
                              email: '',
                              name: 'Anonymous Guest',
                              bio: '',
                              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                              isLoggedIn: false
                            });
                            triggerToast('Authenticated secure session cleared', 'info');
                            setActiveTab('auth');
                          }}
                          className="w-full mt-4 py-2 border border-white/10 text-xs font-semibold text-gray-300 rounded-none hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest font-mono cursor-pointer"
                        >
                          Log Out
                        </button>
                      </div>

                      {/* Customize Avatar and details card */}
                      <div className="bg-[#121419]/90 border border-white/10 rounded-none p-6 flex flex-col gap-4 text-left">
                        <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Modify Details</div>
                        
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Display Name</label>
                            <input 
                              type="text" 
                              value={userSession.name}
                              onChange={(e) => setUserSession(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full mt-1 bg-[#0f1115] border border-white/10 text-xs text-white px-3 py-2 rounded-none focus:outline-none focus:border-white/40 transition-all font-medium"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Profile Bio Phrase</label>
                            <textarea 
                              value={userSession.bio}
                              rows={2}
                              onChange={(e) => setUserSession(prev => ({ ...prev, bio: e.target.value }))}
                              className="w-full mt-1 bg-[#0f1115] border border-white/10 text-xs text-white px-3 py-2 rounded-none focus:outline-none focus:border-white/40 transition-all font-medium resize-none leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Linked Avatar URL</label>
                            <input 
                              type="text" 
                              value={userSession.avatar}
                              onChange={(e) => setUserSession(prev => ({ ...prev, avatar: e.target.value }))}
                              className="w-full mt-1 bg-[#0f1115] border border-white/10 text-xs text-white px-3 py-2 rounded-none focus:outline-none focus:border-white/40 transition-all font-medium truncate"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Saved Designs portfolio tracker */}
                    <div className="md:col-span-2 flex flex-col gap-6 text-left">
                      
                      {/* Metric Display Rows */}
                      <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-2">
                        <div className="bg-[#121419]/90 border border-white/10 p-4 rounded-none">
                          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Active Days</div>
                          <div className="text-2xl font-serif italic text-white mt-1">{countTotalActiveDays} d</div>
                        </div>

                        <div className="bg-[#121419]/90 border border-white/10 p-4 rounded-none">
                          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Est. Commits</div>
                          <div className="text-2xl font-serif italic text-[#39d353] mt-1" style={{ color: getColorHex(4) }}>{Math.round(calculatedCommitsCount)}</div>
                        </div>

                        <div className="bg-[#121419]/90 border border-white/10 p-4 rounded-none">
                          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Local Layouts</div>
                          <div className="text-2xl font-serif italic text-white mt-1">{sessionSavedDesigns.length} records</div>
                        </div>
                      </div>

                      {/* Catalog list */}
                      <div className="bg-[#121419]/90 border border-white/10 rounded-none p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <h2 className="text-xs font-bold tracking-wider uppercase text-white">Your Saved Matrix Catalog</h2>
                          <span className="text-[10px] font-mono text-gray-500">Persistent list of canvas exports</span>
                        </div>

                        {sessionSavedDesigns.length === 0 ? (
                          <div className="text-center py-12 border border-dashed border-white/10 flex flex-col items-center gap-3">
                            <FolderLock className="w-8 h-8 text-white/20 stroke-1" />
                            <div className="text-xs text-gray-400 font-medium tracking-wide">No local designs cataloged yet.</div>
                            <button 
                              onClick={() => setActiveTab('editor')}
                              className="text-[10px] font-mono uppercase tracking-widest text-[#a5b4fc] underline hover:text-white cursor-pointer"
                            >
                              Go to Editor and Paint Grid
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3.5">
                            {sessionSavedDesigns.map((record) => (
                              <div 
                                key={record.id}
                                className="p-4 bg-[#0f1115]/50 border border-white/5 hover:border-white/15 flex items-center justify-between transition-all"
                              >
                                <div>
                                  <div className="text-xs font-bold text-white">{record.name}</div>
                                  <div className="text-[10px] text-gray-500 font-mono mt-1">
                                    Modified: {new Date(record.updatedAt).toLocaleString()} • Cells Painted: {record.pixels.length}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Load design "${record.name}" into active workspace grid? This replaces active drawing state.`)) {
                                        const newGrid: Record<string, number> = {};
                                        record.pixels.forEach(p => {
                                          newGrid[`${p.w}_${p.d}`] = p.level;
                                        });
                                        setPixels(newGrid);
                                        setDesignName(record.name);
                                        triggerToast(`Loaded "${record.name}" successfully`, 'success');
                                        setActiveTab('editor');
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-white text-black text-[9px] font-mono uppercase tracking-widest font-extrabold hover:bg-neutral-200 transition-all rounded-none cursor-pointer"
                                    title="Load into workspace"
                                  >
                                    Load Layout
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Identify: Permanent delete "${record.name}"?`)) {
                                        try {
                                          const savedListJSON = localStorage.getItem('gitgraph_saved_designs');
                                          const savedList: SavedDesign[] = savedListJSON ? JSON.parse(savedListJSON) : [];
                                          const filtered = savedList.filter(item => item.id !== record.id);
                                          localStorage.setItem('gitgraph_saved_designs', JSON.stringify(filtered));
                                          
                                          // Update local state
                                          setSessionSavedDesigns(filtered);
                                          triggerToast(`Layout pruned from portfolio.`, 'success');
                                        } catch (e) {
                                          console.error(e);
                                        }
                                      }
                                    }}
                                    className="p-1 px-[9px] border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs rounded-none font-bold cursor-pointer"
                                    title="Delete design permanently"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              </motion.div>
            )}

            {activeTab === 'auth' && (
              <motion.div 
                key="auth"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-full flex items-center justify-center p-8 z-10"
              >
                <div className="max-w-md w-full bg-[#121419]/95 border border-white/10 rounded-none p-8 shadow-2xl backdrop-blur relative flex flex-col gap-6 text-left">
                  
                  {/* Visual Header */}
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                      <FolderLock className="w-5 h-5 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-serif italic text-white tracking-tight uppercase">Authorize Dev Workspace</h2>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-1">Configure profile handles and access grid templates</p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      
                      const formEl = e.currentTarget;
                      const userVal = (formEl.querySelector('#auth-username') as HTMLInputElement)?.value || 'developer';
                      const emailVal = (formEl.querySelector('#auth-email') as HTMLInputElement)?.value || 'dev@gitgraph.ai';
                      const nameVal = (formEl.querySelector('#auth-displayname') as HTMLInputElement)?.value || 'Active Developer';
                      const avatarVal = (formEl.querySelector('[name="auth-avatar"]:checked') as HTMLInputElement)?.value || 
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

                      setUserSession({
                        username: userVal.toLowerCase().replace(/\s+/g, ''),
                        email: emailVal,
                        name: nameVal,
                        bio: 'Enthusiastic grid compositor. Committed to beautiful graphs and clean visual branches.',
                        avatar: avatarVal,
                        isLoggedIn: true
                      });

                      triggerToast(`Welcome back, ${nameVal}! Session loaded.`, 'success');
                      setActiveTab('editor');
                    }}
                    className="flex flex-col gap-4 text-left"
                  >
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono">Username Handle</label>
                      <input 
                        id="auth-username"
                        required
                        placeholder="e.g. hackercat"
                        type="text" 
                        defaultValue="hacker_prime"
                        className="w-full mt-1 bg-[#0f1115] border border-white/10 text-xs text-white px-3 py-2.5 rounded-none focus:outline-none focus:border-white/50 transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#a5b4fc] font-mono">Developer Email</label>
                      <input 
                        id="auth-email"
                        required
                        placeholder="e.g. cats@coder.io"
                        type="email" 
                        defaultValue="hack@coder.io"
                        className="w-full mt-1 bg-[#0f1115] border border-white/10 text-xs text-white px-3 py-2.5 rounded-none focus:outline-none focus:border-white/50 transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#fda4af] font-mono">Profile Title Name</label>
                      <input 
                        id="auth-displayname"
                        required
                        placeholder="e.g. Alex Rivera"
                        type="text" 
                        defaultValue="Alex Rivera"
                        className="w-full mt-1 bg-[#0f1115] border border-white/10 text-xs text-white px-3 py-2.5 rounded-none focus:outline-none focus:border-white/50 transition-all font-medium"
                      />
                    </div>

                    {/* Fun Avatar Selector! */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono">Select Design Avatar</label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {[
                          { val: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Tech Lead' },
                          { val: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', label: 'Design Architect' },
                          { val: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', label: 'Ecosystem Lead' },
                          { val: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Principal Fellow' }
                        ].map((avatarItem, animIdx) => (
                          <label key={animIdx} className="cursor-pointer relative group flex flex-col items-center">
                            <input 
                              type="radio" 
                              name="auth-avatar" 
                              value={avatarItem.val} 
                              defaultChecked={animIdx === 0}
                              className="sr-only peer"
                            />
                            <img 
                              referrerPolicy="no-referrer"
                              src={avatarItem.val} 
                              alt={avatarItem.label} 
                              className="w-12 h-12 rounded-full border-2 border-transparent object-cover shrink-0 peer-checked:border-white peer-checked:scale-105 transition-all opacity-80 group-hover:opacity-100"
                            />
                            <div className="text-[8px] text-gray-500 font-mono mt-1 text-center scale-90 peer-checked:text-white truncate w-full">{avatarItem.label}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full mt-4 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-none cursor-pointer"
                    >
                      Authenticate Workspace
                    </button>

                  </form>

                  <div className="text-[10px] text-center text-gray-500 font-mono leading-relaxed px-4">
                    Creates an encrypted local profile instance within your current web browser session space safely.
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* Global sticky footer */}
        <footer className="h-10 border-t border-[#464554]/30 bg-[#060f16] flex justify-between items-center px-6 shrink-0 z-20 text-[11px] font-mono tracking-wider font-semibold uppercase text-[#c7c4d7]/50 select-none">
          <span>Built for Developers • Open Source</span>
          <div className="flex gap-4">
            <a className="hover:text-primary transition-colors cursor-pointer">Privacy</a>
            <a className="hover:text-primary transition-colors cursor-pointer">Terms</a>
            <a className="hover:text-primary transition-colors cursor-pointer">GitHub Status</a>
          </div>
        </footer>

      </div>

    </div>
  );
}
