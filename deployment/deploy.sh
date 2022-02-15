#!/usr/bin/env bash
rm -rf akron2front-1.0.0.tgz
npm pack ../
scp akron2front-1.0.0.tgz root@akronenglish1.com:~
scp provision-akron-front.sh root@akronenglish1.com:~
ssh root@akronenglish1.com "chmod 500 ./provision-akron-front.sh; ./provision-akron-front.sh"
