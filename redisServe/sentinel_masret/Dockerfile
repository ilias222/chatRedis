FROM ubuntu

RUN apt-get update 
RUN apt install -y redis-server
RUN apt-get install -y systemd
RUN apt-get install -y systemctl
RUN apt-get install -y nano

RUN rm /etc/redis/redis.conf
RUN rm /etc/redis/sentinel.conf
COPY redis.conf /etc/redis 
COPY runRedis.sh /etc/redis 

CMD ["bash", "redis-server /etc/redis/sentinel.conf --sentinel"]