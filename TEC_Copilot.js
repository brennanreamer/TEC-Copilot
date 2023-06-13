function openChat() { //Open the chatbot
    document.getElementById("chat-button").style.display = 'none';
    document.getElementById("chat-container").style.display = 'grid';
    
    document.getElementById('message-container').innerHTML = ''; //Reset Messages
    var messageContainer = document.getElementById('message-container');
    //Create a new received message
    var receivedMessage = document.createElement('div');
    receivedMessage.classList.add('message', 'received');
    receivedMessage.textContent = "Hello, how can I help?";
    
    //Append the new message to the message container
    messageContainer.appendChild(receivedMessage);
    scrollToBottom();
    
    //Get Station and App from Props as context for the chatbot
    let station = getValue('Station');
    let app = getValue('App');
    if (station != null)
        document.getElementById('station').innerHTML = "Station " + station;
    updateHeaderBorder();
}

function closeChat() { //Close the chatbot
    document.getElementById("chat-button").style.display = 'block';
    document.getElementById("chat-container").style.display = 'none';
    
    document.getElementById('message-container').innerHTML = '';
}

function scrollToBottom() {
    var content = document.getElementById('content');
    content.scrollTop = content.scrollHeight;
}

var lastSent = '';
var lastReceived = '';
    
function sendMessage() {
    var userInput = document.getElementById('user-input');
    var messageContainer = document.getElementById('message-container');
    var chatContainer = document.getElementById('chat-container');
    
    //Create a new sent message
    var sentMessage = document.createElement('div');
    sentMessage.classList.add('message', 'sent');
    
    //Get Station and App from Props as context for the chatbot
    let station = getValue('Station');
    let app = getValue('App');
    
    sentMessage.textContent = userInput.value;

    //Append the new message to the message container
    messageContainer.appendChild(sentMessage);
    scrollToBottom();
    
    //Show loading symbol while AI thinks
    var loading = document.createElement('div');
    loading.classList.add('loading');
    messageContainer.appendChild(loading);
    scrollToBottom();
    updateHeaderBorder();

    var url = "https://querydocsdemo.azurewebsites.net/api/query-documents";
    var params = {
        "query": `Context: Station ${station}, App: ${app}.n` +
            "You are a helpful assistant to visitors in the Tulip showroom.n" +
            `The last message from the user was: "${lastSent}".n` +
            `Your last answer was: "${lastReceived}".n` +
            `Provide a short (2 sentence maximum) answer to this question: "${userInput.value}"`,
        "deployment": "tecchatwithdocuments",
    }
    var xhr = new XMLHttpRequest();
    const apiKey = "INSERT API KEY HERE";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("authorization", "Bearer " + apiKey);
    
    xhr.onload = function() {
        //Remove Loading symbol
        messageContainer.removeChild(messageContainer.lastChild)
        
        //Create a new received message
        var receivedMessage = document.createElement('div');
        receivedMessage.classList.add('message', 'received');
        const response = JSON.parse(this.responseText)
        receivedMessage.textContent = response.answer;
        
        //Append the new message to the message container
        messageContainer.appendChild(receivedMessage);
        scrollToBottom();
        
        lastSent = userInput.value;
        lastReceived = response.answer;
    };
    xhr.send(JSON.stringify(params));
    
    //Clear the input field
    userInput.value = '';
    
    //Scroll to the bottom of the content
    scrollToBottom();
}

function updateHeaderBorder() {
    var content = document.getElementById('content');
    var header = document.getElementById('header');
    
    if (content.scrollHeight > content.clientHeight) {
        header.style.borderBottom = '1px solid #ccc';
    } else {
        header.style.borderBottom = 'none';
    }
}

document.getElementById("chat-button").onclick = function(){openChat()}; //Open Chat when button is clicked
document.getElementById("exit-icon").onclick = function(){closeChat()};

document.getElementById("send-button").onclick = function(){
    if (document.getElementById('user-input').value != '')
        sendMessage();
};

var chatContainer = document.getElementById('chat-container');
var chatButton = document.getElementById('chat-button');
document.addEventListener('click', function(event) {
    if (!chatContainer.contains(event.target) && event.target !== chatButton && event.target !== document.getElementById('chat-icon')) {
        chatContainer.style.display = 'none';
        chatButton.style.display = 'block';
    }
})