export interface SummarizeRequest {
  url: string;
}

export interface SummarizeResponse {
  success: boolean;
  title: string;
  originalUrl: string;
  language: string;
  markdown: string;
  characterCount?: number;
  wordCount?: number;
  error?: string;
  details?: string;
}

export interface WikipediaParsedUrl {
  isValid: boolean;
  language: string;
  title: string;
  rawUrl: string;
}

export interface WikipediaArticleData {
  title: string;
  language: string;
  canonicalUrl: string;
  extract: string;
  pageId: number;
}

export interface ZaiApiResponse {
  id?: string;
  choices?: Array<{
    message?: {
      role: string;
      content: string;
    };
    finish_reason?: string;
  }>;
  error?: {
    message?: string;
    code?: string | number;
    type?: string;
  };
}
