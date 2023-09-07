document.addEventListener("DOMContentLoaded", () => {
  fetchUserNameList();
});

const token = localStorage.getItem('token');

function fetchUserNameList(){
axios
    .get(`http://localhost:3000/chatApp/fetch-username`,{headers:{"Authorization":token}})
    .then((response) => {
    document.getElementById("userId").innerHTML=`User ID: ${response.data.user[0].id}`;
    document.getElementById("username").innerHTML=`User Name: ${response.data.user[0].name}`;
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

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", searchUsers);
function searchUsers(){
axios.get(`http://localhost:3000/chatApp/fetch-users?search=${searchInput.value}`,{headers:{"Authorization":token}})
.then((response) => {
    
    const searchResultsList = document.getElementById("search-results");
            searchResultsList.innerHTML = "";
           const searchResults = response.data.users;
            searchResults.forEach((user) => {
                showUser(user.name, user.id);
            });
      })
      .catch((err)=>{
        console.log(err);
      })
}

function showUser(name, id){
    var parentEle= document.getElementById("search-results");
    var childEle=document.createElement("li");
    childEle.setAttribute("id","user");
    childEle.setAttribute("data-user-id", id);
    childEle.innerHTML=name;
    parentEle.appendChild(childEle);

    childEle.addEventListener("click", function () {
        const userIDsInput = document.getElementById("user_ids");
        const userId = this.getAttribute("data-user-id");
        
        // Check if the input field already has content
        if (userIDsInput.value.trim() === "") {
            // If it's empty, set the clicked user's ID directly
            userIDsInput.value = userId;
        } else {
            // If there is already content, append the clicked user's ID with a comma
            userIDsInput.value += `,${userId}`;
        }
    });
}
