<div align="center">

```
███╗   ██╗ ██████╗ ████████╗██████╗ ███████╗██████╗ ██╗ █████╗ 
████╗  ██║██╔═══██╗╚══██╔══╝██╔══██╗██╔════╝██╔══██╗██║██╔══██╗
██╔██╗ ██║██║   ██║   ██║   ██████╔╝█████╗  ██║  ██║██║███████║
██║╚██╗██║██║   ██║   ██║   ██╔═══╝ ██╔══╝  ██║  ██║██║██╔══██║
██║ ╚████║╚██████╔╝   ██║   ██║     ███████╗██████╔╝██║██║  ██║
╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝     ╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝
```

**`Wikipedia → AI → Ders Notu`** — sıfırdan sonuca, saniyeler içinde.

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GLM-4.7](https://img.shields.io/badge/Z.ai_GLM--4.7-FF6B35?style=for-the-badge&logo=openai&logoColor=white)](https://api.z.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

</div>

---

## `_` Nedir?

**notPedia**, bir Wikipedia bağlantısını yapıştırdığında sihir başlayan bir araçtır.

Makaleyi çeker → GLM-4.7-Flash ile işler → Yapılandırılmış ders notuna dönüştürür.  
Sonucu ekranda görürsün, bir tıkla kopyalarsın ya da `.md` dosyası olarak indirirsin.

> Karmaşıklığı gizle. Sadeliği göster.

---

## `◈` Temel Özellikler

```
┌─────────────────────────────────────────────────────────┐
│  &  Akıllı Wikipedia Çekici                             │
│     · tr / en / de / fr · tüm dil varyantları           │
│     · Mobil linkler & yönlendirmeler otomatik çözülür   │
│     · Reklamsız, saf düz metin çekimi                   │
├─────────────────────────────────────────────────────────┤
│  &  Z.ai GLM-4.7-Flash Entegrasyonu                     │
│     · Özet  ·  Önemli Noktalar                          │
│     · Anahtar Terimler  ·  Çıkarımlar                   │
├─────────────────────────────────────────────────────────┤
│  &  Zengin Markdown Çıktı                               │
│     · react-markdown + remark-gfm                       │
│     · Tek tıkla panoya kopyala                          │
│     · .md dosyası olarak indir (Blob API)               │
├─────────────────────────────────────────────────────────┤
│  &  Aşamalı Yüklenme Animasyonu                         │
│     · Adım adım geri bildirim                           │
│     · Kapsamlı hata yönetimi                            │
└─────────────────────────────────────────────────────────┘
```

---

## `◈` Teknoloji Yığını

| Katman | Teknoloji |
|:--|:--|
| **Framework** | Next.js 14 — App Router |
| **Dil** | TypeScript 5 |
| **Stil** | Tailwind CSS + @tailwindcss/typography |
| **Markdown** | react-markdown · remark-gfm |
| **İkonlar** | Lucide React |
| **Yapay Zekâ** | Z.ai GLM-4.7-Flash |
| **API Katmanı** | Next.js Route Handlers (Edge Ready) |

---

## `◈` Dosya Haritası

```
notPedia/
│
├── app/
│   ├── api/summarize/
│   │   └── route.ts          ← Wikipedia + Z.ai orkestrasyon
│   ├── globals.css           ← Cam efektleri & özel stiller
│   ├── layout.tsx            ← Kök layout · SEO meta
│   └── page.tsx              ← Ana UI & state yönetimi
│
├── components/
│   ├── Header.tsx            ← Üst gezinme & logo
│   ├── SearchBar.tsx         ← URL girişi & örnek etiketler
│   ├── LoadingState.tsx      ← Animasyonlu yükleme kartı
│   ├── ResultCard.tsx        ← Markdown render · kopyala · indir
│   └── ErrorAlert.tsx        ← Hata & yönlendirme kartı
│
├── lib/
│   ├── types.ts              ← TypeScript arayüzleri
│   ├── wikipedia.ts          ← URL ayrıştırıcı & API istemcisi
│   └── zai.ts                ← GLM-4.7-Flash istemcisi
│
├── .env.local.example        ← Çevre değişkeni şablonu
└── next.config.mjs
```

---

## `◈` Kurulum

### 1 — Depoyu Klonla

```bash
git clone https://github.com/enesimrakresmi/notPedia.git
cd notPedia
```

### 2 — Bağımlılıkları Yükle

```bash
npm install
```

### 3 — API Anahtarını Ayarla

```bash
cp .env.local.example .env.local
```

`.env.local` içine anahtarını yapıştır:

```env
ZAI_API_KEY=your_zai_api_key_here

# Opsiyonel
ZAI_BASE_URL=https://api.z.ai/api/paas/v4/chat/completions
```

> **API Anahtarı nereden alınır?**  
> → [Z.ai](https://api.z.ai/) veya [Zhipu AI BigModel](https://open.bigmodel.cn/) — ücretsiz hesap yeterli.

### 4 — Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

`http://localhost:3000` — açılır, kullanıma hazır.

### 5 — Production Derlemesi

```bash
npm run build
npm run start
```

---

## `◈` Nasıl Kullanılır?

```
1.  Herhangi bir Wikipedia makale linkini kopyala
        ↓
2.  notPedia arama kutusuna yapıştır
        ↓
3.  "Özetle" butonuna bas
        ↓
4.  Yapılandırılmış ders notunu oku / kopyala / indir
```

**Desteklenen link formatları:**

```
https://tr.wikipedia.org/wiki/Yapay_zekâ
https://en.wikipedia.org/wiki/Artificial_intelligence
https://en.m.wikipedia.org/wiki/Machine_learning       ← mobil link
https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz  ← kodlanmış URL
```

---

## `◈` Yapay Zekâ Çıktı Formatı

Her özet dört bölümden oluşur:

```markdown
## 📌 Özet
Makalenin ana fikrini özetleyen kısa paragraf.

## ⚡ Önemli Noktalar
- Madde 1
- Madde 2

## 🔑 Anahtar Terimler & Kişiler
| Terim | Açıklama |
| ----- | -------- |

## 💡 Çıkarımlar & Bağlantılar
Konuyu derinleştiren bağlamsal yorumlar.
```

---

## `◈` Katkı

```bash
# Fork → Branch → Commit → PR

git checkout -b feat/your-feature
git commit -m "feat: açıklama"
git push origin feat/your-feature
```

Her türlü katkı açıktır — hata raporu, özellik önerisi, PR.

---

<div align="center">

**notPedia** · MIT Lisansı · [enesimrakresmi](https://github.com/enesimrakresmi)

`Wikipedia'yı ders notuna çeviren araç.`

</div>
