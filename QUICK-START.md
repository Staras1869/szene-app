# Szene App - Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- VS Code (recommended)

## Setup Instructions

### 1. Navigate to Project Directory
\`\`\`bash
cd szene-app
# OR
cd mannheim-restaurants
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# OR
yarn install
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
# OR
yarn dev
\`\`\`

### 4. Open Browser
Navigate to: http://localhost:3000

## Common Issues

### "package.json not found"
- Make sure you're in the project directory
- Run `pwd` to check current location
- Run `ls -la` to see available files

### Permission Errors
- Try: `sudo npm install`
- Or use yarn instead: `yarn install`

### Port Already in Use
- Kill existing process: `lsof -ti:3000 | xargs kill -9`
- Or use different port: `npm run dev -- -p 3001`

## Project Structure
\`\`\`
szene-app/
├── app/                 # Next.js 13+ app directory
├── components/          # React components
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # CSS files
├── package.json        # Dependencies
└── next.config.js      # Next.js configuration
\`\`\`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
