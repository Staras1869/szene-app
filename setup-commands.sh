#!/bin/bash
# Commands to run in VS Code terminal

echo "🎯 Step 1: Clone your repository"
git clone https://gitlab.com/Staras1869-group/Staras1869-project.git
cd Staras1869-project

echo "🎯 Step 2: Install Node.js dependencies"
npm install

echo "🎯 Step 3: Start development server"
npm run dev

echo "🎯 Step 4: Open in browser"
echo "Go to: http://localhost:3000"
