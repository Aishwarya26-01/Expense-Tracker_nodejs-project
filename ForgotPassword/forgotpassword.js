const forgotPassword = async(event) => {
    try {
        event.preventDefault();
        const userDetails = {email: event.target.email.value};
        console.log(userDetails);

        let response = await axios.post("http://localhost:3000/password/forgotpassword", userDetails);
        if(response.status === 201) {
            document.body.innerHTML += '<div style="color:darkgreen; font-size:30px; font-weight:bold">Mail sent successfully</div>';
        } else {
            throw new Error('Something went wrong');
        }
    }
    catch(err) {
        console.log(err);
        document.body.innerHTML += `<div style="color:darkred; font-size:30px; font-weight:bold">${err}</div>`;
    }
}