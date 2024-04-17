#!/bin/bash

# Load nvm and install/use node from .nvmrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install

# Clean and reinstall dependencies
echo "Cleaning up node modules and reinstalling..."
rm -rf node_modules package-lock.json
npm install

# Update Expo CLI globally
echo "Updating Expo CLI..."
npm install -g expo-cli

# Start the project
echo "Starting the Expo project..."
expo start
