#!/usr/bin/env bash
ng build ngx-link-preview --prod
cp ./README.md dist/ngx-link-preview/
cp ./LICENSE dist/ngx-link-preview/
cd dist/ngx-link-preview
npm publish
cd ../..
