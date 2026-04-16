# VS Code Setup Guide for Your Szene App

## Step 1: Clone Repository (Fix Permission Issue)

The error you're seeing happens because you're trying to clone directly to a restricted directory. Here's how to fix it:

### Method 1: Use VS Code's Clone Repository Feature

1. **Click "Clone Repository"** (visible in your VS Code welcome screen)
2. **Paste this URL when prompted:**
   \`\`\`
   https://github.com/Staras1869/szene-app.git
   \`\`\`
3. **When asked where to save, choose:**
   - Click "Choose folder"
   - Navigate to **Documents**
   - Create a new folder called "Projects" 
   - Select the Projects folder
   - Click "Select Repository Location"

### Method 2: Use Terminal with Correct Path

1. **Open VS Code Terminal:** `Terminal` → `New Terminal`
2. **Run these commands one by one:**
   \`\`\`bash
   # Go to Documents folder
   cd ~/Documents
   
   # Create a Projects folder
   mkdir Projects
   
   # Go into Projects folder
   cd Projects
   
   # Clone your repository
   git clone https://github.com/Staras1869/szene-app.git
   
   # Go into your project
   cd szene-app
   \`\`\`

## Step 2: Install Dependencies

Once you have the code locally:

\`\`\`bash
# Install all required packages
npm install
\`\`\`

## Step 3: Start Development Server

\`\`\`bash
# Start your app locally
npm run dev
\`\`\`

Your app will be available at: http://localhost:3000

## Step 4: Open Project in VS Code

If you used the terminal method:
1. **File** → **Open Folder**
2. **Navigate to:** `Documents/Projects/szene-app`
3. **Click "Open"**

## Troubleshooting

### If you get permission errors:
- Never clone directly to `/Users/username/` 
- Always use subdirectories like `Documents/Projects/`
- Make sure you have write permissions to the target directory

### If npm install fails:
- Make sure Node.js is installed: `node --version`
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and try again: `rm -rf node_modules && npm install`

### If the app won't start:
- Check if port 3000 is already in use
- Try a different port: `npm run dev -- --port 3001`
