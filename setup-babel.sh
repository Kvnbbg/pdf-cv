#!/bin/bash

# Step 1: Install Babel CLI and Core
echo "Installing Babel CLI and Core..."
npm install --save-dev @babel/core @babel/cli

# Step 2: Install Presets and Plugins
echo "Installing presets and plugins..."
npm install --save-dev @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime

# Step 3: Create or Update .babelrc
echo "Creating or updating .babelrc configuration..."
BABELRC_CONTENT='{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-runtime"]
}'

echo "$BABELRC_CONTENT" > .babelrc

echo "Babel setup completed successfully."