import { NextRequest, NextResponse } from "next/server";
import { fetchWikipediaArticle } from "@/lib/wikipedia";
import { summarizeWithZai } from "@/lib/zai";
import { SummarizeRequest, SummarizeResponse } from "@/lib/types";

export const maxDuration = 60; // Vercel / serverless zaman aşımı toleransı
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: SummarizeRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<SummarizeResponse>(
        {
          success: false,
          title: "",
          originalUrl: "",
          language: "tr",
          markdown: "",
          error: "Geçersiz istek gövdesi. Lütfen JSON formatında bir URL gönderin.",
        },
        { status: 400 }
      );
    }

    const { url } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json<SummarizeResponse>(
        {
          success: false,
          title: "",
          originalUrl: "",
          language: "tr",
          markdown: "",
          error: "Lütfen bir Wikipedia makale URL'si girin.",
        },
        { status: 400 }
      );
    }

    // 1. Wikipedia içeriğini çek
    let articleData;
    try {
      articleData = await fetchWikipediaArticle(url.trim());
    } catch (wikiErr: any) {
      return NextResponse.json<SummarizeResponse>(
        {
          success: false,
          title: "",
          originalUrl: url,
          language: "tr",
          markdown: "",
          error: wikiErr.message || "Wikipedia makalesi getirilemedi.",
        },
        { status: 400 }
      );
    }

    // 2. Z.ai GLM-4.7-Flash ile özetle ve not çıkar
    let markdown: string;
    try {
      markdown = await summarizeWithZai(
        articleData.title,
        articleData.extract,
        articleData.language,
        articleData.canonicalUrl
      );
    } catch (aiErr: any) {
      return NextResponse.json<SummarizeResponse>(
        {
          success: false,
          title: articleData.title,
          originalUrl: articleData.canonicalUrl,
          language: articleData.language,
          markdown: "",
          error: aiErr.message || "Yapay zekâ modeli ile özetleme sırasında bir hata oluştu.",
        },
        { status: 500 }
      );
    }

    // Karakter ve kelime sayısı hesaplama
    const characterCount = markdown.length;
    const wordCount = markdown.split(/\s+/).filter(Boolean).length;

    return NextResponse.json<SummarizeResponse>({
      success: true,
      title: articleData.title,
      originalUrl: articleData.canonicalUrl,
      language: articleData.language,
      markdown,
      characterCount,
      wordCount,
    });
  } catch (error: any) {
    return NextResponse.json<SummarizeResponse>(
      {
        success: false,
        title: "",
        originalUrl: "",
        language: "tr",
        markdown: "",
        error: "Beklenmeyen bir sunucu hatası oluştu.",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
