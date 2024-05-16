const clientRedis = require('redis');

const client = clientRedis.createClient();

// const client = clientRedis.createClient({
//     url: 'redis://alice:foobared@awesome.redis.server:port'
// });

client.connect();
    
const connectUse = (name, room, id) => {
        client.hSet(`online${id}`, name, room);
}

const chunksUse = (id) => {
        client.get(`online${id}`);
}

const reversUse = (id) => {
    client.get(`ofline${id}`);
}

// При дисконекте - прописываем юзера отключенным, записываем имя и предыдущий id
// При перезагрузки страницы - у юзера остается в локал сторедж предыдущий id
// Если совпадает с записаным в редиске, то переписываем локал сторедж новым
// И возвращаем в чат

const disconectUse = (name, room, id) => {
        client.hDel(`${id}`, name, room);
        client.hSet(`ofline${name}`, id);
}

const messageRoom = (room, user, date, message) => {
        client.rPush(room, user)
        client.rPush(room, String(date))
        client.rPush(room, message)
    }

const chunksRoomMessage = (room) => {
    return new Promise((resolve, reject) => {
        resolve (client.lRange(room, 0, -1));
    });
}

module.exports.connectUse = connectUse;
module.exports.chunksUse = chunksUse;
module.exports.disconectUse = disconectUse;
module.exports.messageRoom = messageRoom;
module.exports.chunksRoomMessage = chunksRoomMessage;
module.exports.reversUse = reversUse;
