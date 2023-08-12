function registerUser(event) {
    event.preventDefault();

    const name = event.target.name.value;;
    const email = event.target.email.value;
    const password = event.target.password.value

    const obj = {
        name,
        email,
        password
    }
    console.log(obj);
    
    axios.post("http://localhost:3000/user/signup", obj)
        .then((Response) => {
            console.log(showUserOnScreen(Response.data.newUserDetail));
        })
        .catch((err) => {
            console.log(err)
        });
}

window.addEventListener("DOMContentLoaded", () => {
    axios.get("http://localhost:3000/user/get-users")
        .then((Response) => {
                console.log(Response);
        })
        .catch(err => console.log(err));
})

function showUserOnScreen(user) {
    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';

    // const parentElem = document.getElementById('listOfUsers');
    // const createUserHtml = `<li id='${user.id}'>${user.name} - ${user.email}</li>`

    // parentElem.innerHTML += createUserHtml;
}