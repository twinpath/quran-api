# Quran JSON

> *Bismillahir Rahmanir Rahim*  
> *In the name of Allah, the Most Gracious, the Most Merciful.*

A modern, open-source, edge-native web application and developer interface for exploring and integrating the Holy Quran JSON dataset. Engineered with precision, humility, and dedication to serving the global developer community.

---

## Intention and Moral Foundations

The Quran is the divine, immutable Word of Allah Subhanahu wa Ta'ala. In providing this digital resource, our sole aspiration is to facilitate beneficial knowledge (*'ilm nafi'*) and offer an enduring service (*sadaqah jariyah*) to developers, educators, researchers, and believers worldwide.

### Developer Stewardship & Ethics
- **Data Fidelity**: Preserving the authentic Arabic text, official translations, and authoritative tafsir with uncompromising diligence.
- **Open and Unencumbered Access**: Completely free, public, and open-source under the MIT license, with zero paywalls, zero tracking, and zero commercial constraints.
- **Humility & Accountability**: While the Holy Quran is divine and flawless, any human translation, transcription, or software implementation is subject to inadvertent human error. We welcome constructive peer review, issue reports, and community corrections with profound gratitude.

---

## Repository Architecture

This repository adopts a decoupled dual-branch architecture:

1. **`data` Branch (Canonical Dataset)**:
   - Contains the pure, static JSON dataset generated from verified sources.
   - Structured per-surah (`surah/1.json` through `surah/114.json`), alongside zero-padded variants (`surah-3digit/001.json` through `114.json`).
   - Maintained independently as a lightweight submodule or worktree.

2. **`web` Branch (Edge Application)**:
   - The interactive web interface, interactive API playground, and developer documentation portal.
   - Built on Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS.
   - Deployed at the edge on Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`).

---

## Dataset Schema

Each surah is represented as a structured JSON object:

```json
{
  "name": "الفاتحة",
  "name_latin": "Al-Fatihah",
  "number": "1",
  "number_of_ayah": "7",
  "text": {
    "1": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    "2": "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ",
    "3": "الرَّحْمٰنِ الرَّحِيْمِۙ",
    "4": "مٰلِكِ يَوْمِ الدِّيْنِۗ",
    "5": "اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُۗ",
    "6": "اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَۙ",
    "7": "صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ ەۙ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّاۤلِّيْنَ"
  },
  "translations": {
    "id": {
      "name": "Al-Fatihah",
      "text": {
        "1": "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.",
        "2": "Segala puji bagi Allah, Tuhan semesta alam,",
        "3": "Yang Maha Pengasih lagi Maha Penyayang,",
        "4": "Pemilik hari pembalasan.",
        "5": "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.",
        "6": "Bimbinglah kami ke jalan yang lurus,",
        "7": "(yaitu) jalan orang-orang yang telah Engkau beri nikmat, bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) orang-orang yang sesat."
      }
    }
  },
  "tafsir": {
    "id": {
      "kemenag": {
        "name": "Kemenag",
        "source": "Kementerian Agama Republik Indonesia",
        "text": {
          "1": "Surah ini dimulai dengan membaca basmalah...",
          "2": "...",
          "3": "..."
        }
      }
    }
  }
}
```

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server & Client Components)
- **Language**: TypeScript 5
- **UI & Design**: Tailwind CSS v4, shadcn/ui, Radix primitives
- **Icons**: Lucide React
- **Runtime & Deployment**: Cloudflare Workers with OpenNext (`@opennextjs/cloudflare`) & Wrangler

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/twinpath/quran-json.git
cd quran-json

# Ensure you are on the web branch
git checkout web

# Install dependencies
pnpm install

# Run the local development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Cloudflare Edge Preview & Deployment

```bash
# Generate Cloudflare environment types
pnpm cf-typegen

# Build and preview locally with the Cloudflare Worker runtime
pnpm preview

# Build and deploy directly to Cloudflare Workers
pnpm deploy
```

---

## Dataset Lineage and Acknowledgments

We express our sincere appreciation to the contributors and institutions that made this dataset possible:

- **Source Authority**: [Kementerian Agama Republik Indonesia (Kemenag RI)](https://quran.kemenag.go.id) for the authentic Arabic texts, official Indonesian translations, and Tafsir Al-Qur'an.
- **Original Dataset Creator**: [Rio Astamal](https://github.com/rioastamal/quran-json) for the foundational curation and extraction script.
- **Maintenance & Modernization**: [Twinpath](https://github.com/twinpath/quran-json) for building and maintaining the edge-native web application and modern JSON tooling.

---

## Contributing

Contributions that improve data accuracy, accessibility, performance, and developer experience are warmly welcomed.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/refinement`).
3. Commit your modifications with clear, descriptive commit messages.
4. Open a Pull Request for review.

If you observe any discrepancy in the Quranic text or translations, please open an issue immediately so that it can be verified and rectified with highest priority.

---

## License

This project is open-source and distributed under the [MIT License](LICENSE.md). May it serve as a source of benefit and continuous good.
