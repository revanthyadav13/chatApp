document.addEventListener("DOMContentLoaded", fetchMessageList);
document.addEventListener("DOMContentLoaded", fetchUserNameList);
setInterval(fetchMessageList, 1000);
const token=localStorage.getItem('token');

function fetchUserNameList(){
axios
    .get(`http://localhost:3000/chatApp/fetch-username`,{headers:{"Authorization":token}})
    .then((response) => {
    for(var i=0;i<response.data.username.length;i++){
           showUserNames(response.data.username[i])
     }
      })
      .catch((err)=>{
        console.log(err);
      })
}
function fetchMessageList(){
axios
    .get(`http://localhost:3000/chatApp/fetch-message`,{headers:{"Authorization":token}})
    .then((response) => {
      document.getElementById("username").innerHTML=response.data.username[0].name;
      clearList();
    for(var i=0;i<response.data.allChats.length;i++){
           showChat(response.data.allChats[i])
     }
      })
      .catch((err)=>{
        console.log(err);
      })
}
  


document.getElementById("message-input").focus();

const sendBtn=document.getElementById("send-button");

sendBtn.addEventListener('click',textValidation);

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
             clearList();
            fetchMessageList();
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

function showUserNames(userOnline){
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