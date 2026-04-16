# First, let's check where we are
pwd

# Navigate to Desktop
cd ~/Desktop

# Create a proper project directory
mkdir szene-app
cd szene-app

# Initialize the project
npm init -y

# Install Next.js and dependencies
npm install next@latest react@latest react-dom@latest
npm install @types/node @types/react @types/react-dom typescript
npm install tailwindcss postcss autoprefixer
npm install lucide-react
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge

# Initialize Tailwind CSS
npx tailwindcss init -p
