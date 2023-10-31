const token = localStorage.getItem('token');

const registerExpense = async(event) => {
    event.preventDefault();
    const expenseDetails = {
        expenseAmount: event.target.expenseAmount.value,
        expenseDesc: event.target.expenseDesc.value,
        expenseCategory: event.target.expenseCategory.value
    };
    try{
        let response = await axios.post("http://localhost:3000/expense/add-expense", expenseDetails, {headers: {"Authorization": token}})
        showNewExpenseOnScreen(response.data.expense)

        document.getElementById("expenseAmount").value='';
        document.getElementById("expenseDesc").value='';
        document.getElementById("expenseCategory").value='';
    } catch(err) {
        showError(err)
    }
}

function showPremiumUserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden";
    document.getElementById('message').innerHTML = "You are a premium user";
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    var jsonPayLoad = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayLoad);
}

window.addEventListener("DOMContentLoaded", async() => {
    try{
        const token = localStorage.getItem('token');
        const pageSize = localStorage.getItem('pageSize');
        const page = 1;
        const decodeToken = parseJwt(token);
        const ispremiumuser = decodeToken.ispremiumuser;

        if(ispremiumuser) {
            showPremiumUserMessage();
            showLeaderboard();
        }

        let res = await axios.get(`http://localhost:3000/expense/get-expense?page=${page}&pageSize=${pageSize}`, {headers: {"Authorization": token}})
        listExpense(res.data.allExpenses)
        showPagination(res.data)
    } catch(err) {
        showError(err)
    }
})

const showNewExpenseOnScreen = (expense) => {

    const parentNode = document.getElementById('listOfExpenses');
    const createNewExpense = `<li id='${expense.id}'>${expense.expenseAmount} - ${expense.expenseDesc} - ${expense.expenseCategory}
        <button onclick=deleteExpense('${expense.id}')>Delete Expense</button>
        </li>`
        parentNode.innerHTML += createNewExpense;
}

const deleteExpense = async (expenseId) => {
    try{
        await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, {headers: {"Authorization": token}})
        removeExpenseFromScreen(expenseId);
    } catch(err) {
        showError(err)
    }
}

const removeExpenseFromScreen = (expenseId) => {
    const parentNode = document.getElementById('listOfExpenses');
    const elem = document.getElementById(expenseId);
    parentNode.removeChild(elem);
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;">${err}</div>`
}

function showLeaderboard() {
    const inputElement = document.createElement('input');
    inputElement.type = 'button';
    inputElement.value = 'Show Leaderboard';

    inputElement.onclick = async() => {
        console.log(token);
        const userLeaderboard = await axios.get("http://localhost:3000/premium/showLeaderBoard", {headers: {"Authorization": token}})
        console.log(userLeaderboard);

        var leaderboardElem = document.getElementById('leaderboard');
        leaderboardElem.innerHTML += '<h1>Leaderboard</h1>'
        userLeaderboard.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses || 0}</li>`
        })
    }
    document.getElementById('message').appendChild(inputElement);
}

async function download() {
    try{
        const response = await axios.get("http://localhost:3000/expense/download", {headers: {"Authorization": token}})
        if(response.status === 200) {
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'MyExpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message);
        }
    } catch(err) {
        showError(err);
    }
}

document.getElementById('rzp-button1').onclick = async function (event) {
    const response = await axios.get("http://localhost:3000/purchase/premiummembership", {headers: {"Authorization": token}})
    //console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, {headers: {"Authorization": token}})


            alert('You are a premium user now')
            document.getElementById('rzp-button1').style.visibility = "hidden";
            document.getElementById('message').innerHTML = "You are a premium user";
            localStorage.setItem('token', res.data.token);
            showLeaderboard();
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    event.preventDefault();

    rzp1.on('payment.failed', function(response) {
        console.log(response);
        alert('Something went wrong');
    });
}

async function pageSize(val){
    try {
        localStorage.setItem('pageSize',val);
        const page=1
        const res = await axios.get(`http://localhost:3000/expense/get-expense?page=${page}&pageSize=${val}`,{headers:{"Authorization":token}});
        console.log('success');
        console.log(res);
        console.log(res.data.allExpenses);
        listExpense(res.data.allExpenses)
        showPagination(res.data);
    } catch (err) {
        showError(err);
    }
}

async function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage}){
    try{
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = ''
        if(hasPreviousPage){
            const btn2 = document.createElement('button')
            btn2.innerHTML = previousPage
            btn2.addEventListener('click', ()=>getExpenses(previousPage))
            pagination.appendChild(btn2)
        }
        const btn1 = document.createElement('button')
        btn1.innerHTML = currentPage
        btn1.addEventListener('click',()=>getExpenses(currentPage))
        pagination.appendChild(btn1)

        if (hasNextPage){
            const btn3 = document.createElement('button')
            btn3.innerHTML = nextPage
            btn3.addEventListener('click',()=>getExpenses(nextPage))
            pagination.appendChild(btn3)
        }
        if (currentPage!==1){
            const btn4 = document.createElement('button')
            btn4.innerHTML = 'main-page'
            btn4.addEventListener('click',()=>getExpenses(1))
            pagination.appendChild(btn4)
        }
    }
    catch(err){
        showError(err)
    }
}

async function getExpenses(page){
    try {
        const pageSize = localStorage.getItem('pageSize')
    
        const res = await axios.get(`http://localhost:3000/expense/get-expense?page=${page}&pageSize=${pageSize}`,{headers:{"Authorisation":token}});
        console.log(res);
        console.log(res.data.allExpenses);
        listExpense(res.data.allExpenses)
        showPagination(res.data);
    } catch (err) {
        showError(err);
    }
}

async function listExpense(data){
    try {
        const parentNode=document.getElementById('listOfExpenses');
        ///clear the existing expense 
        parentNode.innerHTML='';
        console.log(data);

        for(i in data){
            showNewExpenseOnScreen(data[i])
        }
    } catch (err) {
        showError(err)
    }
}