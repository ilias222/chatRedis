const http = require("http");
const fs = require("fs");
const { Server } = require("socket.io");

const cloud = require("./localCloud/bl_functionCloud.js");
const redisHash = require("./localCloud/bl_RedisHash.js")

let userRooms = [];
let messageAll = {};
let numberchat;
let nameuser;

const server = http.createServer((reqiuest, respons) => { 

    // Типо роутер - Домашная, страница чата, Возврат файла
    switch (reqiuest.method) {
        case 'POST':
            reqiuest.on('data', async (chunk) =>  {
                let json = await chunk.toString('utf-8');
                let jsons = JSON.parse(json);
                numberchat = jsons.numberchat;
                nameuser = jsons.username;
            });
            legal = true;
            fs.createReadStream('staticStorage/html/mychat.html').pipe(respons);
            break;
    
        case 'GET':
            if(reqiuest.url == '/home'){
                fs.createReadStream('staticStorage/html/index.html').pipe(respons);
            } else if (reqiuest.url.indexOf('es:') > 0 || 
                        reqiuest.url.indexOf('con.') > 0){
                                
                fs.stat("staticStorage/" + reqiuest.url.slice(7), (err) => {
                    err ?
                        fs.createReadStream('staticStorage/html/err.html').pipe(respons) :
                        fs.createReadStream("staticStorage/" + reqiuest.url.slice(7)).pipe(respons);

                })
                    
            } else if (reqiuest.url.indexOf('at:') > 0 && legal){
                fs.createReadStream('staticStorage/html/mychat.html').pipe(respons);
                legal = false;
                
            }
            else if(cloud.chunkingArr(reqiuest.url.slice(6), null, userRooms)){
                fs.createReadStream('staticStorage/html/mychat.html').pipe(respons);
            }
            else {
                fs.createReadStream('staticStorage/html/err.html').pipe(respons);
                };
            break;
    }

});

const io = new Server(server)

// Конект пользователя
io.on('connection', (socket) => {

    socket.on('who user', async (local) => {
        nameuser = await local.names;
        numberchat = await local.room;

        userRooms.push({"nameuser": nameuser, "rootnumber" : numberchat, "id" : socket.id});

        redisHash.connectUse(nameuser, numberchat, socket.id)

        socket.join(numberchat);
        [id , room] = socket.rooms;

        // Перебираем масив Юзер - номер комнаты
        io.to(room).emit('user autorize', cloud.pullUser(nameuser, numberchat, socket.id, userRooms));

        const promis = redisHash.chunksRoomMessage(room);

        promis.then((e) => io.to(room).emit('prev_message', e))

        // io.to(room).emit('prev_message', cloud.pullMessage(room, messageAll));
    });

    // прием сообщения от ui клиента
    socket.on('chat message', (msg) => {

        // Отправка сообщения всем клиентам комнаты
        if(cloud.chunkingArr(msg.rooms, null, userRooms) && cloud.chunkingArr(null, msg.names, userRooms)) {
            
            socket.join(numberchat);
            [id , room] = socket.rooms;

            cloud.pushMessage(msg.names, msg.rooms, msg.msg, messageAll);

            redisHash.messageRoom(msg.rooms, msg.names, new Date().getTime(), msg.msg);
            
            io.to(room).emit('new message', msg);
        }
    });

    // При отключении отправка статуса

    socket.on('disconnect', (e) => {

        socket.disconnect(true);

        io.to(numberchat).emit('discon', {"type" : e, "id" : socket.id}); 

        io.to(numberchat).emit('delete user', socket.id);

        //redis del hash

        redisHash.disconectUse(nameuser, numberchat, socket.id)

        cloud.deleteUserRooms(socket.id, userRooms)
      });
});

server.listen(8000, "192.168.0.105");
