let socket = io()

dayjs.extend(dayjs_plugin_relativeTime);

let clientstotal = document.getElementById('clients-total');

let messageContainer = document.getElementById('message-container');
let nameInput = document.getElementById('name-input');
let messageForm = document.getElementById('message-form');
let messageInput = document.getElementById('message-input');

let messageTone = new Audio('/message-tune.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})

socket.on('clients-total', (data) => {
    clientstotal.innerText = `Total Clients: ${data}`;
})

function sendMessage(){
    if(messageInput.value === ''){
        return;
    }
    console.log(messageInput.value);

    let data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }

    socket.emit('message', data)
    addMessageToUI(true, data);

    messageInput.value = "";
}

socket.on('chat-message', (data)=>{
    console.log(data)
    messageTone.play();
    addMessageToUI(false, data);
})

function addMessageToUI(isOwnMessage, data){
    clearFeedback();
    let element = `<li class="${isOwnMessage ? "message-right" : "message-left"}">
                    <p class="message">
                        ${data.message}
                        <span>${data.name} | ${dayjs(data.dateTime).fromNow()}</span>
                    </p>
                </li>
                `
    

    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e)=>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing....`
    })
})

messageInput.addEventListener('keypress', (e)=>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing....`
    })
})

messageInput.addEventListener('blur', (e)=>{
    socket.emit('feedback', {
        feedback: ''
    })
})

socket.on('feedback', (data)=>{
    clearFeedback();
    let element = `<li class="message-feedback">
                    <p class="feedback" id="feedback">
                        ${data.feedback}
                    </p>
                </li>`

    messageContainer.innerHTML += element;
    scrollToBottom();
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach((element) => {
        element.parentNode.removeChild(element)
    })
}