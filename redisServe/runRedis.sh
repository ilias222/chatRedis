#!/bin/bash
# Нужен что бы толкнуть редиску

$(systemctl start redis)
$(systemctl start redis-server)

redis-cli -h 172.25.0.11 -p 6379