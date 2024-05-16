Запуск новой сети в доскер
docker network create --subnet=172.24.0.0/16 mynamenetwork

Запуск контейнера с определенным ip адресом
docker container run --net customnetwork --ip 172.24.0.11 -it TAGcontainer