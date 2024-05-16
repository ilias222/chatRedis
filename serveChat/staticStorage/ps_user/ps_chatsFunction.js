// Функции на стороне клиента, обработка сокетов, вывод статики

let rotationMessage = false;
// Функция по возврату даты
const dumpDate = (unix=false) => {
    let dat;
    unix == false ? dat = new Date() : dat = new Date(unix);
    return `
    ${dat.getHours()} ${dat.getMinutes()} ${dat.getSeconds()} 
    ${dat.getDate()}-${dat.getMonth()}-${dat.getFullYear()}
    `;
    }

  // Функция по растановки сообщений (стили)
  const positionMessage = (userName) => {

      const myitem = document.createElement('div');

      myitem.className = setTimeout(dumpDate().slice(6,8), 1000) + ' message';

      if(userName == localStorage.getItem('username')){
        myitem.style.backgroundColor = 'beige';
        myitem.style.textAlign = 'start';
        rotationMessage = true;
      } else{
        myitem.style.backgroundColor = 'floralwhite';
        myitem.style.textAlign = 'end';
        rotationMessage = false;
      }
  
      return myitem;
  }