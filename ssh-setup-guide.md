# SSH Git Setup Guide

## Setting Up SSH Keys

1. **Check for existing SSH keys**
   \`\`\`
   ls -la ~/.ssh
   \`\`\`
   If you see files like `id_rsa` and `id_rsa.pub`, you already have SSH keys.

2. **Generate a new SSH key** (if needed)
   \`\`\`
   ssh-keygen -t ed25519 -C "your_email@example.com"
   \`\`\`
   - Press Enter to accept the default file location
   - Enter a secure passphrase (or press Enter for no passphrase)

3. **Start the SSH agent**
   \`\`\`
   eval "$(ssh-agent -s)"
   \`\`\`

4. **Add your SSH key to the agent**
   \`\`\`
   ssh-add ~/.ssh/id_ed25519
   \`\`\`

5. **Copy your public key**
   \`\`\`
   cat ~/.ssh/id_ed25519.pub
   \`\`\`
   - Copy the output (starts with "ssh-ed25519" and ends with your email)

6. **Add the key to GitLab**
   - Go to GitLab → Preferences → SSH Keys
   - Paste your key
   - Add a title (e.g., "My MacBook")
   - Click "Add key"

## Cloning with SSH

1. **Copy the SSH URL** from your GitLab repository
   - Look for the "Clone" button
   - Select "SSH"
   - Copy the URL (looks like: `git@gitlab.com:username/project.git`)

2. **Clone the repository**
   \`\`\`
   git clone git@gitlab.com:your-username/your-project.git
   \`\`\`

3. **Navigate into the project folder**
   \`\`\`
   cd your-project
   \`\`\`

4. **Install dependencies**
   \`\`\`
   npm install
   \`\`\`

5. **Start the development server**
   \`\`\`
   npm run dev
   \`\`\`

## Saving Changes with SSH

With SSH, you won't need to enter your password for each push:

\`\`\`
git add .
git commit -m "Your commit message"
git push
