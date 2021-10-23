#!/bin/bash
cd front
npm install
npm run build

cd ..
cd back

npm install
npx pm2 start index.js