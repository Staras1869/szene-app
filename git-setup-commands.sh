#!/bin/bash

# This script helps set up Git with either HTTPS or SSH

echo "Git Setup Helper"
echo "================"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

echo "Git is installed. Version: $(git --version)"

# Check for existing SSH keys
if [ -f ~/.ssh/id_ed25519 ]; then
    echo "SSH keys already exist at ~/.ssh/id_ed25519"
else
    echo "No SSH keys found. You may need to generate them for SSH access."
fi

# Display Git configuration
echo ""
echo "Current Git configuration:"
echo "=========================="
git config --list

echo ""
echo "To clone with HTTPS:"
echo "git clone https://gitlab.com/your-username/your-project.git"
echo ""
echo "To clone with SSH:"
echo "git clone git@gitlab.com:your-username/your-project.git"
echo ""
echo "To set up Git with your identity:"
echo "git config --global user.name \"Your Name\""
echo "git config --global user.email \"your.email@example.com\""
