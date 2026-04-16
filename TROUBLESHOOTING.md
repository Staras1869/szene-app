# Troubleshooting Guide

## Common Issues

### 1. Package.json Not Found
If you get `ENOENT: no such file or directory, open 'package.json'`:

\`\`\`bash
# Check your current directory
pwd

# Navigate to project root
cd ~/Desktop/szene-app
# OR
cd ~/Desktop/mannheim-restaurants

# Verify package.json exists
ls -la | grep package.json
\`\`\`

### 2. Permission Errors
If you get permission denied errors:

\`\`\`bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
\`\`\`

### 3. Node Modules Issues
If dependencies won't install:

\`\`\`bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
\`\`\`

### 4. Port Already in Use
If port 3000 is busy:

\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
\`\`\`

## Success Indicators

When everything works, you should see:
- ✅ `npm install` completes without errors
- ✅ `npm run dev` starts the server
- ✅ Browser opens to `http://localhost:3000`
- ✅ Your Szene app loads with restaurants and events
