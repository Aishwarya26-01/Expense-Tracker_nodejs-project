const registerExpense = async(event) => {
    event.preventDefault();
    const obj = {
        expenseAmount: event.target.expenseAmount.value,
        expenseDesc: event.target.expenseDesc.value,
        expenseCategory: event.target.expenseCategory.value
    };
    try{
        const token = localStorage.getItem('token');
        let response = await axios.post("http://localhost:3000/expense/add-expense", obj, {headers: {"Authorization": token}})
        showNewExpenseOnScreen(response.data.expense)
    } catch(err) {
        document.body.innerHTML += "<h4> Something went wrong </h4>"
        console.log(err)
    }
}

const display = async(event) => {
    try{
        const token = localStorage.getItem('token');
        let response = await axios.get("http://localhost:3000/expense/get-expense", {headers: {"Authorization": token}})
        response.data.expenses.forEach(expense => {
            showNewExpenseOnScreen(expense);
        })
    } catch(err) {
        console.log(err)
    }
}

const showNewExpenseOnScreen = (expense) => {
    document.getElementById("expenseAmount").value='';
    document.getElementById("expenseDesc").value='';
    document.getElementById("expenseCategory").value='';

    const parentNode = document.getElementById('listOfExpenses');
    const createNewExpense = `<li id='${expense.id}'>${expense.expenseAmount} - ${expense.expenseDesc} - ${expense.expenseCategory}
        <button onclick=deleteExpense('${expense.id}')>Delete Expense</button>
        </li>`
        parentNode.innerHTML += createNewExpense;
}

const deleteExpense = async (expenseId) => {
    try{
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, {headers: {"Authorization": token}})
        removeExpenseFromScreen(expenseId);
    } catch(err) {
        console.log(err);
    }
}

const removeExpenseFromScreen = (expenseId) => {
    const parentNode = document.getElementById('listOfExpenses');
    const elem = document.getElementById(expenseId);
    parentNode.removeChild(elem);
}

window.addEventListener("DOMContentLoaded", display);

document.getElementById('rzp-button1').onclick = async function (event) {
    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:3000/purchase/premiummembership", {headers: {"Authorization": token}})
    //console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, {headers: {"Authorization": token}})


            alert('You are a premium user now')
            document.getElementById('rzp-button1').style.visibility = "hidden";
            document.getElementById('message').innerHTML = "You are a premium user";
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