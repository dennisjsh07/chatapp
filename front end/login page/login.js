const form = document.querySelector('form');
// console.log(form);
form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    try{
        const response = await axios.post('http://localhost:4000/user/login', myObj);
        console.log(response.data);

        // save token in local storage...
        localStorage.setItem('token',response.data.token);

        // redirect...
        window.location.href = 'http://127.0.0.1:5500/allGroups%20page/allgroups.html';

    } catch(err){
        console.log(err)
    }

    form.reset();
}
 