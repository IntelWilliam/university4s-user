#!/usr/bin/env bash
tar xvfz akron2front-1.0.0.tgz -C /opt/akron2front
cd /opt/akron2front/package && npm install
rm -rf dist
rm -rf public
npm run build-prod && npm run dist
# npm run minify-public && npm run minify-dist
systemctl restart akron2front.service
