#!/usr/bin/env bash
tar xvfz re-bilingual-1.0.0.tgz -C /opt/re-bilingual
cd /opt/re-bilingual/package && npm install
rm -rf dist
rm -rf public
npm run build && npm run dist
systemctl restart re-bilingual.service