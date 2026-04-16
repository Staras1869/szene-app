# HTTPS Git Setup Guide

## Cloning with HTTPS

1. **Copy the HTTPS URL** from your GitLab repository
   - Look for the "Clone" button
   - Select "HTTPS"
   - Copy the URL (looks like: `https://gitlab.com/username/project.git`)

2. **Open VS Code Terminal**
   - Go to Terminal → New Terminal
   - Navigate to where you want to store your project:
   \`\`\`
   cd Documents/Projects
   \`\`\`

3. **Clone the repository**
   \`\`\`
   git clone https://gitlab.com/your-username/your-project.git
   \`\`\`

4. **Enter your GitLab credentials** when prompted

5. **Navigate into the project folder**
   \`\`\`
   cd your-project
   \`\`\`

6. **Install dependencies**
   \`\`\`
   npm install
   \`\`\`

7. **Start the development server**
   \`\`\`
   npm run dev
   \`\`\`

## Saving Changes with HTTPS

When you push changes, you'll need to enter your GitLab username and password:

\`\`\`
git add .
git commit -m "Your commit message"
git push
\`\`\`

**Note:** You might need to enter your credentials frequently with HTTPS.
