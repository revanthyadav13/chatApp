let currentGroupId = null;
document.addEventListener("DOMContentLoaded", fetchUserGroups);

const newGroupBtn = document.getElementById("new-group-button");
newGroupBtn.addEventListener('click', toggleCreateGroupForm);

function toggleCreateGroupForm() {
  const createGroupForm = document.getElementById('create-group-form');
  createGroupForm.style.display = createGroupForm.style.display === 'none' ? 'block' : 'none';
}

const storedMessages = JSON.parse(localStorage.getItem(`group${currentGroupId}`)) || [];
let lastMessageId = storedMessages.length > 0 ? storedMessages[storedMessages.length - 1].id : undefined;

function scrollToLatestMessage() {
  const parentEle = document.getElementById("listOfMessages");
  parentEle.scrollTop = parentEle.scrollHeight;
}

function fetchFromLocalStorage() {
  clearList();
  if (currentGroupId !== null) {
    const storageKey = `group${currentGroupId}`;
    const storedMessages = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (storedMessages.length > 0) {
      for (const message of storedMessages) {
        showChat(message.name, message.message);
      }
    }
  }
  scrollToLatestMessage();
}

function createNewGroup(event) {
  event.preventDefault();
  const groupname = document.getElementById("groupname").value;
  const userIds = document.getElementById("user_ids").value.split(',').map(id => parseInt(id.trim(), 10));

  axios.post('http://localhost:3000/group/create-group', { groupname, userIds }, { headers: { "Authorization": token } })
    .then((response) => {
      console.log(response);
      toggleCreateGroupForm();
      fetchUserGroups();
    })
    .catch((err) => {
      console.log(err);
    });
}

function fetchUserGroups() {
  axios.get('http://localhost:3000/group/userGroups', { headers: { "Authorization": token } })
    .then((response) => {
      const listOfGroups = document.getElementById('listOfGroups');
      listOfGroups.innerHTML = '';

      response.data.groups.forEach(group => {
        const li = document.createElement('li');
        li.textContent = group.groupname;
        li.addEventListener('click', () => switchToGroup(group.id, group.groupname));
        listOfGroups.appendChild(li);
      });

    })
    .catch((err) => {
      console.log(err);
    });
}


let messageInterval;
const storedMessagesByGroup = {};
function switchToGroup(groupId, groupName) {
  currentGroupId = groupId;
  const chatWindow = document.querySelector('.chat-window');
  chatWindow.style.display = 'block';
  updateGroupName(groupName);
   storedMessagesByGroup[currentGroupId] = [];
  lastMessageId = undefined;
  fetchGroupMembers(groupId);
  if (messageInterval) {
    clearInterval(messageInterval);
  }

  messageInterval = setInterval(() => {
    fetchMessages(groupId);
  }, 1000);
}

function updateGroupName(groupName) {
  const groupNameContainer = document.getElementById('group-name-container');
  groupNameContainer.textContent = groupName;
}

function fetchMessages(groupId) {
  axios.get(`http://localhost:3000/group/messages/${groupId}?lastMessageId=${lastMessageId}`, { headers: { "Authorization": token } })
    .then((response) => {
      if (lastMessageId === undefined) {
        lastMessageId = -1;
      }

      const newMessages = response.data.messages;
      if (newMessages.length > 0) {
        storedMessagesByGroup[currentGroupId] = storedMessagesByGroup[currentGroupId] || [];
        for (const message of newMessages) {
          storedMessagesByGroup[currentGroupId].push({ id: message.id, name: message.name, message: message.message });
          showChat(message.name, message.message);
          lastMessageId = message.id;
        }

        const maxStoredMessages = 10;
        while (storedMessagesByGroup[currentGroupId].length > maxStoredMessages) {
          storedMessagesByGroup[currentGroupId].shift(); // Remove the oldest message
        }

        localStorage.setItem(`group${currentGroupId}`, JSON.stringify(storedMessagesByGroup[currentGroupId]));
        }
        clearList();
        fetchFromLocalStorage();
    })
    .catch((err) => {
      console.log(err);
    });
}

function showChat(name, message) {
  const parentEle = document.getElementById("listOfMessages");
  const childEle = document.createElement("li");
  childEle.textContent = `${name}: ${message}`;
  parentEle.appendChild(childEle);
}

document.getElementById('send-button').addEventListener('click', sendMessage);

function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value.trim();

  if (messageText && currentGroupId) {
    axios.post(`http://localhost:3000/group/send-message`, { groupId: currentGroupId, text: messageText }, { headers: { "Authorization": token } })
      .then((response) => {
        const user = response.data.message;
        if (user && user.name && user.message) {
          const storedMessages = JSON.parse(localStorage.getItem(`group${currentGroupId}`)) || [];
          storedMessages.push({ id: user.id, name: user.name, message: user.message });
          localStorage.setItem(`group${currentGroupId}`, JSON.stringify(storedMessages));
        }

        clearList();
        fetchFromLocalStorage();
        // Clear the input field after sending the message
        messageInput.value = '';
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function clearList() {
   const parentEle = document.getElementById("listOfMessages");
  while (parentEle.firstChild) {
    parentEle.removeChild(parentEle.firstChild);
  }
}

function fetchGroupMembers(groupId) {
  axios.get(`http://localhost:3000/group/members/${groupId}`, { headers: { "Authorization": token } })
    .then((response) => {
      const groupMembersList = document.getElementById('listOfGroupMembers');
      groupMembersList.innerHTML = '';

      const groupMembers = response.data.members;
        groupMembers.forEach((groupMember)=>{
          showGroupMembers(groupMember.groupId, groupMember.id, groupMember.username, groupMember.isAdmin);
        })
     
    })
    .catch((err) => {
      console.log(err);
    });
}

function showGroupMembers(groupId, userId, username, isAdmin) {
  const parentEle = document.getElementById("listOfGroupMembers");
  const listItem = document.createElement("li");
  listItem.textContent = username;

  const adminLabel = document.createElement("span");
  adminLabel.textContent = " (Group Admin)";
  adminLabel.style.display = isAdmin ? "block" : "none"; // Show for admins
  listItem.appendChild(adminLabel);

  const makeAdminButton = document.createElement("button");
  makeAdminButton.textContent = "Make Admin";
  makeAdminButton.className = "make-admin-button";
  makeAdminButton.style.display = isAdmin ? "none" : "block"; // Hide for admins
  listItem.appendChild(makeAdminButton);

  const dismissAdminButton = document.createElement("button");
  dismissAdminButton.textContent = "Dismiss Admin";
  dismissAdminButton.className = "dismiss-admin-button";
  dismissAdminButton.style.display = isAdmin ? "block" : "none"; // Show for admins
  listItem.appendChild(dismissAdminButton);

  const removeUserButton = document.createElement("button");
  removeUserButton.textContent = "Remove User";
  removeUserButton.className = "remove-user-button";
  listItem.appendChild(removeUserButton);

  
makeAdminButton.addEventListener("click", makeAdmin);
 function makeAdmin() {
  axios.put(`http://localhost:3000/group/make-admin/${groupId}/${userId}`, {}, { headers: { "Authorization": token } })
    .then((response) => {
      console.log(response.data.message);
    adminLabel.style.display = "block";
    makeAdminButton.style.display = "none";
    dismissAdminButton.style.display = "block";
      })
    .catch((error) => {
      console.error(error);
    });
}

dismissAdminButton.addEventListener("click", dismissAdmin);
function dismissAdmin() {
  axios.put(`http://localhost:3000/group/dismiss-admin/${groupId}/${userId}`, {}, { headers: { "Authorization": token } })
    .then((response) => {
      console.log(response.data.message);
    adminLabel.style.display = "none";
    makeAdminButton.style.display = "block";
    dismissAdminButton.style.display = "none";
      })
    .catch((error) => {
      console.error(error);
    });
}

removeUserButton.addEventListener("click", removeUser);
function removeUser() {
  axios.delete(`http://localhost:3000/group/remove-member/${groupId}/${userId}`, { headers: { "Authorization": token } })
    .then((response) => {
      console.log(response.data.message);
      listItem.remove();
    })
    .catch((error) => {
      console.error(error);
    });
}

  parentEle.appendChild(listItem);
}





