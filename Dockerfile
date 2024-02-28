FROM node:18-alpine

ENV WAPPALYZER_ROOT /opt/wappalyzer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_BIN /usr/bin/chromium-browser

RUN apk update && apk add -u --no-cache \
	nodejs \
  udev \
  chromium \
  ttf-freefont \
  yarn

RUN mkdir -p "$WAPPALYZER_ROOT/browsers"

WORKDIR "$WAPPALYZER_ROOT"

COPY technologies ./technologies
COPY \
  server.js \
  categories.json \
  driver.js \
  package.json \
  wappalyzer.js \
  yarn.lock ./

RUN yarn global add nodemon
RUN yarn install

ENTRYPOINT ["nodemon", "server.js"]
