# Tools Collection 🛠️

A comprehensive web platform that aggregates useful tools built with [Next.js](https://nextjs.org). This project provides a centralized platform to access various tools through a unified interface.

## ✨ Features

- 🎯 Comprehensive collection of useful tools in one website
- 🎨 Modern and user-friendly interface
- 📱 Responsive design, compatible with all devices
- ⚡ High performance with Next.js and React
- 🔍 Easy tool search and categorization

## 🚀 Getting Started

### System Requirements

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/NaKMiers/Tools_102.git
cd Tools_102
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the results.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: CSS Modules / Tailwind CSS
- **Font**: [Geist](https://vercel.com/font) - optimized font from Vercel

## 📁 Project Structure

```
tools/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── globals.scss     # Global styles
│   ├── components/          # Reusable components
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── README.md
└── package.json
```

## 🔧 Scripts

```bash
npm run dev          # Run development server
npm run build        # Build for production
npm run start        # Run production server
npm run lint         # Check code with ESLint
```

## 🎯 Roadmap

- [ ] Add text tools
- [ ] Color conversion tools
- [ ] Encoding/decoding tools
- [ ] API tools and testing
- [ ] Image and media tools
- [ ] Developer utilities

## 🤝 Contributing

All contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is distributed under the MIT License. See the `LICENSE` file for more details.

## 📞 Contact

- **Author**: NaKMiers
- **Repository**: [Tools_102](https://github.com/NaKMiers/Tools_102)

## 🚀 Deploy

The website can be easily deployed on:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
