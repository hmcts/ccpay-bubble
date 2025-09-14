rm -rf node_modules
rm -rf .angular
rm -rf dist
yarn install
yarn ng:build
yarn postbuild
lsof -ti:3000 | xargs kill
lsof -ti:4200 | xargs kill
yarn start:express-dev
