async function registerUser(event) {
    try{
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
        const response = await axios.post("http://localhost:3000/user/signup", obj)
            if(response.status === 201) {
            } else {
            }
    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    }
}