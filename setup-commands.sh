#!/bin/bash

# Create a Projects directory in your home folder
mkdir -p ~/Documents/Projects

# Navigate to the Projects directory
cd ~/Documents/Projects

# Clone your repository
git clone https://github.com/Staras1869/szene-app.git

# Navigate into the project
cd szene-app

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
