# First, let's check where we are
pwd

# Navigate to your project folder (I can see it's called SZENE-APP in VS Code)
cd szene-app

# If that doesn't work, try:
# cd mannheim-restaurants

# Or if it's in a different location:
# cd ~/Desktop/szene-app

# Check if package.json exists
ls -la | grep package.json

# If you see package.json, then run:
npm install
npm run dev

# If you get permission errors:
sudo npm install

# Alternative package manager:
yarn install
yarn dev
