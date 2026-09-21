import { WikipediaArticleData, WikipediaParsedUrl } from "./types";

/**
 * Kullanıcının girdiği URL'den Wikipedia dil kodunu ve makale başlığını ayrıştırır.
 * Desteklenen formatlar:
 * - https://tr.wikipedia.org/wiki/Yapay_zek%C3%A2
 * - https://en.m.wikipedia.org/wiki/Artificial_intelligence
 * - https://de.wikipedia.org/wiki/Albert_Einstein#Leben
 * - https://tr.wikipedia.org/w/index.php?title=Yapay_zek%C3%A2
 */
export function parseWikipediaUrl(inputUrl: string): WikipediaParsedUrl {
  const trimmed = inputUrl.trim();

  try {
    const urlObj = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);

    // Hostname kontrolü: *.wikipedia.org
    const hostParts = urlObj.hostname.toLowerCase().split(".");
    const wikiIndex = hostParts.indexOf("wikipedia");

    if (wikiIndex === -1 || hostParts[wikiIndex + 1] !== "org") {
      return {
        isValid: false,
        language: "tr",
        title: "",
        rawUrl: inputUrl,
      };
    }

    // Dil kodunu çıkar (örn: 'tr', 'en', 'de'). Mobil 'tr.m' ise ilk parçayı al.
    let lang = hostParts[0];
    if (lang === "m" && hostParts.length > 2) {
      lang = hostParts[1];
    } else if (lang.includes("m") && hostParts.length >= 3 && hostParts[1] === "m") {
      lang = hostParts[0];
    }
    if (!lang || lang === "www" || lang === "wikipedia") {
      lang = "tr";
    }

    let title = "";

    // /wiki/BASLIK formatı
    if (urlObj.pathname.includes("/wiki/")) {
      const pathAfterWiki = urlObj.pathname.split("/wiki/")[1];
      if (pathAfterWiki) {
        title = decodeURIComponent(pathAfterWiki);
      }
    } else if (urlObj.pathname.includes("index.php") && urlObj.searchParams.has("title")) {
      // /w/index.php?title=BASLIK formatı
      title = decodeURIComponent(urlObj.searchParams.get("title") || "");
    }

    // Anchor (#) ve alt çizgi temizliği
    title = title.split("#")[0].replace(/_/g, " ").trim();

    if (!title) {
      return {
        isValid: false,
        language: lang,
        title: "",
        rawUrl: inputUrl,
      };
    }

    return {
      isValid: true,
      language: lang,
      title,
      rawUrl: inputUrl,
    };
  } catch {
    return {
      isValid: false,
      language: "tr",
      title: "",
      rawUrl: inputUrl,
    };
  }
}

/**
 * Wikipedia API üzerinden makalenin tam ve düz metin (plain text) özetini çeker.
 * Yönlendirmeleri (redirects) otomatik çözer.
 */
export async function fetchWikipediaArticle(url: string): Promise<WikipediaArticleData> {
  const parsed = parseWikipediaUrl(url);

  if (!parsed.isValid || !parsed.title) {
    throw new Error(
      "Geçersiz Wikipedia bağlantısı! Lütfen geçerli bir Wikipedia makale URL'si girin. (Örn: https://tr.wikipedia.org/wiki/Yapay_zekâ)"
    );
  }

  const { language, title } = parsed;

  // Wikipedia MediaWiki Action API sorgusu
  const apiUrl = new URL(`https://${language}.wikipedia.org/w/api.php`);
  apiUrl.searchParams.set("action", "query");
  apiUrl.searchParams.set("format", "json");
  apiUrl.searchParams.set("prop", "extracts");
  apiUrl.searchParams.set("explaintext", "1"); // HTML etiketleri olmadan düz metin
  apiUrl.searchParams.set("redirects", "1"); // Yönlendirmeleri otomatik takip et
  apiUrl.searchParams.set("titles", title);
  apiUrl.searchParams.set("origin", "*");

  const res = await fetch(apiUrl.toString(), {
    headers: {
      "User-Agent": "WikiNotBot/1.0 (https://wikinot.app; contact@wikinot.app) NextJS/14",
      Accept: "application/json",
    },
    // Next.js fetch cache ayarı: aynı başlık için 1 saat önbellek
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Wikipedia API'sine erişilemedi. Durum kodu: ${res.status}`);
  }

  const data = await res.json();
  const pages = data.query?.pages;

  if (!pages) {
    throw new Error("Wikipedia içeriği çözümlenemedi.");
  }

  // Sayfaları incele (-1 ise bulunamadı demektir)
  const pageId = Object.keys(pages)[0];
  const page = pages[pageId];

  if (!page || page.missing !== undefined || pageId === "-1") {
    throw new Error(`"${title}" başlıklı Wikipedia makalesi bulunamadı. Lütfen URL'yi kontrol edin.`);
  }

  let extract: string = page.extract || "";

  if (!extract.trim()) {
    throw new Error("Bu makalede özetlenebilecek metin içeriği bulunamadı.");
  }

  // Aşırı uzun makaleler için token optimizasyonu (~40.000 karakter sınırı)
  const MAX_CHAR_LIMIT = 40000;
  if (extract.length > MAX_CHAR_LIMIT) {
    extract = extract.slice(0, MAX_CHAR_LIMIT) + "\n\n...[Makalenin devamı bağlam sınırı nedeniyle kırpıldı]...";
  }

  const resolvedTitle = page.title || title;
  const canonicalUrl = `https://${language}.wikipedia.org/wiki/${encodeURIComponent(resolvedTitle.replace(/ /g, "_"))}`;

  return {
    title: resolvedTitle,
    language,
    canonicalUrl,
    extract,
    pageId: Number(pageId),
  };
}
