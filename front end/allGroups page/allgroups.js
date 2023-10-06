const groupSelect = document.getElementById('groups'); // Select element

async function getGroups() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/group/get-group', {
            headers: { 'Authorization': token }
        });

        // console.log(response.data);

        // Clear existing options
        groupSelect.innerHTML = '';

        // Populate select options
        for(var i = 0; i<response.data.length; i++){
            const option = document.createElement('option');
            // option.value = group.id; // Assuming you have an 'id' field in your group object
            option.textContent = response.data[i].groupname;
            groupSelect.appendChild(option);
        } 

    } catch (error) {
        console.error('Error fetching groups:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getGroups();
});

const form = document.querySelector('form');
// console.log(form);
form.addEventListener('submit', getInsideGroup);
import { displayAllMessages } from '../chat page/chat';

async function getInsideGroup(e){
    e.preventDefault();

    const option = document.getElementById('groups').value;
    // console.log('option>>>>', option)
    localStorage.setItem('groupName', option);

    // use sockets...
    socket.emit('join-room', option, message=>{
        displayAllMessages(message);
    }); // sending message to backend...

    // redirect to groupchat page...
    window.location.href = 'http://127.0.0.1:5500/chat%20page/chat.html';
}

const logOutButton = document.getElementById('log-out');

logOutButton.addEventListener('click', () => {
    // Clear local storage
    localStorage.clear();
    // Close the browser window
    window.close();
    // Redirect to the login page
    window.location.href = 'http://127.0.0.1:5500/login%20page/login.html';
});
 