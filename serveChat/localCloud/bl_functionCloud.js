/*
Функции локальной обработки сообщений и статуса юзера в комнате чата
userRooms - массив, который содержит всех юзеров, их комнаты и id в сессии
Юзер удаляется из массива, если сменил комнату - сразу в нескольких не может состоять
messageAll - объект json, содержит историю сообщений юзеров по каждой комнате

Функции имеют последний параметр - object, этот параметр по дефолду null
Но предполагает наличие указанных объектов, иначе все повалиться
/*

/**
 * 
 * @param {*} user имя юзера
 * @param {*} room номер комнаты
 * @param {*} msg сообщение
 * @param {*} object massageALL объект json {room{user, data, message ...}...}
 * @returns true
 */

// Добавляем комнату, юзера, и массив из даты и сообщения
const pushMessage = (user, room, msg, object=null) => {
    if(object[room]){
        object[room].push(user);
        object[room].push(new Date().getTime());
        object[room].push(msg); 
    } else{
        object[room] = [];
        object[room].push(user);
        object[room].push(new Date().getTime());
        object[room].push(msg);
    }
    return true;
}

/**
 * 
 * @param {*} nameuser имя юзера
 * @param {*} room номер комнаты
 * @param {*} id id юзера в данной сессии
 * @param {*} objects userRooms массив юзеров комнат и id ['username','numberroom','id'...]
 * @returns локальный список юзеров комнаты
 */

// Возвращаем список юзеров из комнаты
const pullUser = (nameuser, room, id=null, objects=null) => {

    let searchUserRoom;

        searchUserRoom = objects.filter((elem) =>{
            if(elem.rootnumber == room){
                return elem;
            } else if (elem.nameuser == nameuser){
                elem.rootnumber = room;
                return elem;
            }
        });

    return searchUserRoom;
};

/**
 * 
 * @param {*} id id юзера в сессии
 * @param {*} object userRooms массив юзеров комнат и id ['username','numberroom','id'...]
 */

//Удаляем юзера из массива, когда тот выходит из комнаты
const deleteUserRooms = (id, object=null) => {
    object.find((elem, index) => {
        if (elem.id == id){
            delete object[index];
        };
    });

    object.sort();
    object.pop();
};

/**
 * 
 * @param {*} room номер комнаты
 * @param {*} user имя юзера
 * @param {*} object userRooms массив юзеров комнат и id ['username','numberroom','id'...]
 * @returns bool
 */

// Проверяем в массиве, есть ли записанный юзер или комната
const chunkingArr = (room=null, user=null, object=null) => {
    let acsses = false;
    object.forEach((elem) => {
       if(elem.rootnumber == room || elem.nameuser == user){ 
        acsses = true;
       }
    });

    return acsses;
}

/**
 * 
 * @param {*} rooms номер комнаты юзера
 * @param {*} object massageALL объект json {room{user, data, message ...}...}
 * @returns сообщения данной комнаты, или bool-false
 */

// Проверяем объект полных сообщений, выдаем список юзеров и их сообщений в определенной комнате
const pullMessage = (rooms, object=null) => {

    if(object[rooms]){
        return object[rooms];
    } else {
        return false;
    }
};

module.exports.pullUser = pullUser;
module.exports.deleteUserRooms = deleteUserRooms;
module.exports.chunkingArr = chunkingArr;
module.exports.pullMessage = pullMessage;
module.exports.pushMessage = pushMessage;