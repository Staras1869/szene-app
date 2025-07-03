# Szene App - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- VS Code (recommended)
- Git

## Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 3. Open Browser
Navigate to: http://localhost:3000

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

## Project Structure

\`\`\`
szene-app/
├── app/                 # Next.js 13+ App Router
├── components/          # React components
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # CSS files
└── package.json        # Dependencies
\`\`\`

## Features

- 🍽️ Restaurant listings
- 🎉 Event discovery
- 📱 PWA support
- 🌐 Multi-language
- 📍 Location-based
- ⚡ Real-time updates

## Troubleshooting

### Port Already in Use
\`\`\`bash
lsof -ti:3000 | xargs kill -9
npm run dev
\`\`\`

### Clear Cache
\`\`\`bash
npm cache clean --force
rm -rf node_modules
npm install
\`\`\`
