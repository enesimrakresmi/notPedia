import { ZaiApiResponse } from "./types";

const SYSTEM_PROMPT = `Sen Wikipedia makalelerini Türkçe özetleyen bir asistansın. Sana verilen metni analiz et; özet, önemli noktalar, anahtar terimler/kişiler ve çıkarımlar başlıkları altında Markdown formatında düzenli bir not çıkar. Sadece Markdown döndür.`;

/**
 * Z.ai GLM-4.7-Flash API Çağrısı
 * - Otomatik 429 (Rate Limit / Concurrency) yeniden deneme mekanizması
 * - Token & gecikme optimizasyonu
 */
export async function summarizeWithZai(
  title: string,
  articleText: string,
  language: string,
  canonicalUrl: string
): Promise<string> {
  const apiKey = process.env.ZAI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_zai_api_key_here") {
    throw new Error(
      "Z.ai API anahtarı (ZAI_API_KEY) bulunamadı. Lütfen .env.local dosyanızdaki ZAI_API_KEY değerini kontrol edin."
    );
  }

  const endpoint =
    process.env.ZAI_BASE_URL?.trim() || "https://api.z.ai/api/paas/v4/chat/completions";

  // Çıkarım hızını artırmak ve token limitlerine takılmamak için makaleyi en önemli ilk 14.000 karaktere optimize et
  const optimizedText =
    articleText.length > 14000
      ? articleText.slice(0, 14000) + "\n\n...[Makalenin geri kalanı özetleme performansı için optimize edildi]..."
      : articleText;

  const userPrompt = `Aşağıdaki Wikipedia makalesini analiz et ve belirtilen başlıklarda düzenli, profesyonel bir Türkçe ders/araştırma notu çıkar:

Makale Başlığı: ${title}
Kaynak Dil: ${language.toUpperCase()}
Kaynak Bağlantı: ${canonicalUrl}

Makale İçeriği:
${optimizedText}
`;

  const payload = {
    model: "glm-4.7-flash",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 2500,
    stream: false,
  };

  // 429 veya geçici ağ hataları için 2 defa yeniden deneme (backoff)
  const MAX_RETRIES = 2;
  let lastError = "";

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = (await response.json()) as ZaiApiResponse;

        if (data.error) {
          throw new Error(data.error.message || "Bilinmeyen model hatası");
        }

        const content = data.choices?.[0]?.message?.content;
        if (!content || content.trim() === "") {
          throw new Error("Yapay zekâ boş bir yanıt döndürdü.");
        }

        let formattedMarkdown = content.trim();
        // Modelin eklediği dış markdown çitlerini temizle
        if (formattedMarkdown.startsWith("```markdown") && formattedMarkdown.endsWith("```")) {
          formattedMarkdown = formattedMarkdown.replace(/^```markdown\s*/, "").replace(/```$/, "").trim();
        } else if (formattedMarkdown.startsWith("```") && formattedMarkdown.endsWith("```")) {
          formattedMarkdown = formattedMarkdown.replace(/^```\w*\s*/, "").replace(/```$/, "").trim();
        }

        return formattedMarkdown;
      }

      // Hata yanıtını oku
      let errorBody = "";
      try {
        const errJson = await response.json();
        errorBody = errJson.error?.message || JSON.stringify(errJson);
      } catch {
        errorBody = await response.text();
      }

      // 429 Hatası (Eşzamanlılık veya İstek Sınırı)
      if (response.status === 429) {
        lastError = `Z.ai API istek sınırı (429 - Rate Limit): ${errorBody || "Eşzamanlı istek veya dakika başına kota sınırı."}`;
        if (attempt <= MAX_RETRIES) {
          // 3 saniye bekle ve tekrar dene
          await new Promise((res) => setTimeout(res, 3000));
          continue;
        }
      } else if (response.status === 401 || response.status === 403) {
        throw new Error(
          `Z.ai API yetkilendirme hatası (HTTP ${response.status}). API anahtarınızı kontrol edin: ${errorBody}`
        );
      } else {
        lastError = `Z.ai API hatası (HTTP ${response.status}): ${errorBody}`;
      }
    } catch (err: any) {
      lastError = err.message || "Ağ bağlantı hatası oluştu.";
      if (attempt <= MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, 2000));
        continue;
      }
    }
  }

  throw new Error(
    lastError ||
      "Z.ai API servisi şu anda meşgul veya oran sınırı aşıldı. Lütfen birkaç saniye sonra tekrar deneyin."
  );
}
