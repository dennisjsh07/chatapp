const form = document.querySelector('form');
// console.log(form);
form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        groupName: document.getElementById('groupname').value
    }
            // console.log(myObj);

    try{
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4000/group/add-group', myObj, { headers: { 'Authorization': token } });
        console.log(response.data.newGroups);

        if(response.data.success === true){
            alert('group created');
        } else{
            alert('something went wrong');
        }

        // redirect...
        window.location.href = 'http://127.0.0.1:5500/allGroups%20page/allgroups.html';
    } catch(err){
        console.log(err);
    }

    form.reset();
}
 