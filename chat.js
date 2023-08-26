document.addEventListener("DOMContentLoaded", () => {
  fetchDataAndDisplay();
  setInterval(fetchMessageList, 1000);
});

const token = localStorage.getItem('token');
const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
let lastMessageId = storedMessages.length > 0 ? storedMessages[storedMessages.length - 1].id : undefined;

function fetchDataAndDisplay() {
  fetchUserNameList();
  fetchFromLocalStorage();
  document.getElementById("message-input").focus();
  const sendBtn = document.getElementById("send-button");
  sendBtn.addEventListener('click', textValidation);
}

function scrollToLatestMessage() {
  const parentEle = document.getElementById("listOfMessages");
  parentEle.scrollTop = parentEle.scrollHeight;
}

function fetchFromLocalStorage(){
  clearList();
  if (storedMessages.length > 0) {
    for (const message of storedMessages) {
      showChat(message);
    }
  }
  scrollToLatestMessage();
}

function fetchUserNameList(){
axios
    .get(`http://localhost:3000/chatApp/fetch-username`,{headers:{"Authorization":token}})
    .then((response) => {
    document.getElementById("username").innerHTML=response.data.username[0].name;
    for(var i=0;i<response.data.usersOnline.length;i++){
           showUsersOnline(response.data.usersOnline[i])
     }
      })
      .catch((err)=>{
        console.log(err);
      })
}

function fetchMessageList(){
axios
    .get(`http://localhost:3000/chatApp/fetch-message?lastMessageId=${lastMessageId}`,{headers:{"Authorization":token}})
    .then((response) => {
            if(lastMessageId== undefined){
               lastMessageId=-1
            }
         const newChats = response.data.allChats;
        if (newChats.length > 0) {
        for (const chat of newChats) {
          storedMessages.push({ id: chat.id, name: chat.name, message: chat.message });
          showChat(chat);
          lastMessageId = chat.id;
        }

         const maxStoredMessages = 10;
        while (storedMessages.length > maxStoredMessages) {
          storedMessages.shift(); // Remove the oldest message
        }

        localStorage.setItem('messages', JSON.stringify(storedMessages));
        clearList();
        fetchFromLocalStorage();
      }

      })
      .catch((err)=>{
        console.log(err);
      })
}
  
function textValidation(event){
    event.preventDefault();
    const message=document.getElementById("message-input").value;
    if(!message) {
        sendBtn.style.display = 'none';
    }else{
        saveToDatabase();
    } 
  }

function saveToDatabase(){
const message=document.getElementById("message-input").value;

axios.post('http://localhost:3000/chatApp/send-message',{message},{headers:{"Authorization":token}})
        .then((response)=>{
           const user = response.data.newChat; // Make sure this structure matches your API response
      if (user && user.name && user.message) {
        const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        storedMessages.push({id:user.id, name: user.name, message: user.message });
        localStorage.setItem('messages', JSON.stringify(storedMessages));
      }
      
         clearList();
         fetchFromLocalStorage();
          clearField(); 
          
      })
        .catch((err)=>{
            console.log(err);
        });
   };

function clearField(){
document.getElementById("message-input").value="";
}

function showChat(user){
    var parentEle= document.getElementById("listOfMessages");
    var childEle=document.createElement("li");
    childEle.setAttribute("id","new-message");
    childEle.textContent=`${user.name}:${user.message}`;
    parentEle.appendChild(childEle);

}

function clearList() {
  const parentEle = document.getElementById("listOfMessages");
  while (parentEle.firstChild) {
    parentEle.removeChild(parentEle.firstChild);
  }
}

function showUsersOnline(userOnline){
    var parentEle= document.getElementById("listOfOnlineUsers");
    var childEle=document.createElement("li");
    childEle.setAttribute("id","new-user");
    childEle.innerHTML="&#x1F7E2"+userOnline.name;
    parentEle.appendChild(childEle);
}

function logout(){
  axios.get('http://localhost:3000/chatApp/logout',{headers:{"Authorization":token}})
        .then((response)=>{
             location.href = 'login.html';
      })
        .catch((err)=>{
            console.log(err);
        });
}