document.addEventListener("DOMContentLoaded", () => {
  fetchUserNameList();
});

const token = localStorage.getItem('token');

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



