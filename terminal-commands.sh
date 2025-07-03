# First, let's check if we're in the right directory
pwd

# List files to confirm package.json exists
ls -la | grep package.json

# Install dependencies
npm install

# Start the development server
npm run dev

# If you get permission errors, try:
sudo npm install

# Alternative if npm has issues:
yarn install
yarn dev
