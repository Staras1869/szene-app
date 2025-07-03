# First, let's check if we're in the right directory
pwd

# List files to confirm project folder exists
ls -la

# You should see a folder like 'szene-app' or 'mannheim-restaurants'
# Navigate INTO that folder:
cd szene-app

# OR if it's called something else:
# cd mannheim-restaurants

# Now check if package.json exists:
ls -la | grep package.json

# If you see package.json, then run:
npm install
npm run dev

# If you get permission errors, try:
sudo npm install

# Alternative if npm has issues:
# yarn install
# yarn dev
