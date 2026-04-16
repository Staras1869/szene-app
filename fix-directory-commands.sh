# First, let's see where you are
pwd

# List what's in your current directory
ls -la

# Navigate to the correct project directory
cd ~/Desktop

# Look for your project folder
ls -la | grep szene

# If you see szene-app folder, go into it
cd szene-app

# If you see mannheim-restaurants folder, go into it
cd mannheim-restaurants

# Check if package.json exists
ls -la | grep package.json

# If package.json exists, then run:
npm install
npm run dev
