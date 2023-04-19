#!/bin/bash
echo "[ + ] Preparing environment..."
echo "[ + ] Installing dependencies..."
npm install;
clear;
echo "[ + ] Done!"
echo "[ + ] Running tests..."
npm test; clear;
echo "[ + ] Done!"
npm run build;
echo "[ + ] Done!"

