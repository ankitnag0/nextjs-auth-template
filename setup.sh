#!/bin/bash

# Safety check - prevent accidental runs
if [ -f ".template-setup-complete" ]; then
  echo "❌ Error: Setup has already been run in this repository."
  echo "Running again would destroy your git history and reset your .env file."
  exit 1
fi

echo "🚀 Setting up project..."

echo "📦 Installing dependencies..."
bun install

echo "🗑️  Removing git history..."
rm -rf .git

echo "📝 Creating .env file..."
cp .env.example .env

echo "🗄️  Pushing database schema..."
bun db:push

echo "🔧 Initializing new git repository..."
git init
git add -A
git commit -m "Initial commit"

echo "🔒 Creating setup lock file..."
touch .template-setup-complete

echo "✅ Setup complete! Don't forget to update your .env file with actual values."
