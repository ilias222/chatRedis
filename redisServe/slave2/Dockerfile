FROM debian

RUN apt-get update
RUN apt-get install -y redis-server 
RUN apt-get install -y systemd
RUN apt-get install -y systemctl
RUN apt-get install -y nano

RUN rm /etc/redis/redis.conf
COPY redis.conf /etc/redis
COPY runRedis.sh /etc/redis 

CMD ["bash", "/etc/redis/runRedis.sh"]
