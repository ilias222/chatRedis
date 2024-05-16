FROM debian

RUN apt update
RUN apt install -y nodejs
RUN apt install -y npm
RUN apt-get install -y systemd
RUN apt-get install -y systemctl
RUN apt-get install -y nano
RUN mkdir -p -m=777 www/serveChat

COPY ./serveChat/* /www/serveChat
WORKDIR www/serveChat

RUN npm install

# CMD ["node", "serve.js"]