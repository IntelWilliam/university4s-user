#!/usr/bin/env bash
tar xvfz akron2front-1.0.0.tgz -C /opt/akron2front
cd /opt/akron2front/package && npm install

#npm run build && npm run dist

npm run build-prod && npm run dist
systemctl restart akron2front.service
