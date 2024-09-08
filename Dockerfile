# IMPORTANT! - I currently have a specific configuration on my network adapter and installing Docker would cause troubles on my machine. So I added this file explaining what I would do to achieve the local mirror instead.
# I would add JSDOM to parse the HTML and then create a directory for storing the assets using mkdirp, then I would write the file to new location using dom.serialize()
# This Dockerfile is a POC showing the instructions the container would need to execute to get things running

FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["node", "fetch.js"]