#!/bin/zsh
# Build the site for GitHub Pages (served from orbient.github.io/demo-kelvin/) and publish dist/ to the
# gh-pages branch. 404.html is the same page: it shows the "no light here" screen for unknown addresses.
set -e
cd "$(dirname "$0")/.."
BASE_PATH=/demo-kelvin/ npx vite build
cp dist/index.html dist/404.html
touch dist/.nojekyll
remote=$(git remote get-url origin)
tmp=$(mktemp -d)
cp -R dist/. "$tmp"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$remote" gh-pages
cd - >/dev/null
rm -rf "$tmp"
echo "Published: https://orbient.github.io/demo-kelvin/"
