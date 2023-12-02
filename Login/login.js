async function loginUser(event) {
    try{
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value
    
        const obj = { email, password }
        console.log(obj);
        const response = await axios.post("http://65.2.6.8:3000/user/login", obj)
            if(response.status === 200) {
                alert(response.data.message)
                localStorage.setItem('token', response.data.token)
                window.location.href = "../Expense/expense.html"
            }
        }
    catch(err){
        console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    }
}

function forgotpassword() {
    window.location.href = "../ForgotPassword/forgotpassword.html"
}