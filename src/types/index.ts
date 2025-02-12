export interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    socials?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  };
  date: string;
  status: 'published' | 'draft';
  category: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  status: 'active' | 'inactive';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  permissions?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount?: number;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  blogs?: number;
  isPrimary?: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  title: string;
  altText?: string;
  uploadDate: string;
  size?: string;
  dimensions?: string;
  fileType?: string;
  uploadedBy?: string;
}

export interface SiteSettings {
  general: {
    siteTitle: string;
    tagline: string;
    siteUrl: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  };
  seo: {
    metaDescription: string;
    metaKeywords: string;
    googleAnalyticsId?: string;
    enableSitemap: boolean;
    enableRobotsTxt: boolean;
  };
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  comments: {
    enable: boolean;
    moderationRequired: boolean;
    allowAnonymous: boolean;
    maxNestingLevel: number;
  };
  email: {
    adminEmail: string;
    enableNotifications: boolean;
    notificationTypes: string[];
  };
  security: {
    enableTwoFactor: boolean;
    passwordPolicy: {
      minLength: number;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    allowRegistration: boolean;
  };
}