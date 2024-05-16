document.querySelector('.form_autorize').addEventListener('submit', (e) =>{
    e.preventDefault();

    const name_user = document.querySelector('.user_name').value;
    const number_chat = document.querySelector('.chat_number').value;

    if(name_user && number_chat){

        const jsons = {
            'username': name_user,
            'numberchat': number_chat
        };

        console.log(jsons)


        fetch(`http://192.168.0.105:8000/chat:${number_chat}`, {
            method: 'POST',
            body: JSON.stringify(jsons)
        }).then(item => {
            if(item.status == 200){
                localStorage.setItem('username', jsons.username);
                localStorage.setItem('roomnumber', jsons.numberchat);
                window.location.href = `http://192.168.0.105:8000/chat:${number_chat}`
            }
        }).catch((e) => console.error(e));

    } else {
        alert('Не заполнены обязательные поля')
    }
})