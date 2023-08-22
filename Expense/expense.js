const registerExpense = async(event) => {
    event.preventDefault();
    const obj = {
        expenseAmount: event.target.expenseAmount.value,
        expenseDesc: event.target.expenseDesc.value,
        expenseCategory: event.target.expenseCategory.value
    };
    try{
        let response = await axios.post("http://localhost:3000/expense/add-expense", obj)
        showNewExpenseOnScreen(response.data.newExpenseDetail)
    } catch(err) {
        document.body.innerHTML += "<h4> Something went wrong </h4>"
        console.log(err)
    }
}

const display = async(event) => {
    try{
        let response = await axios.get("http://localhost:3000/expense/get-expense")
        for(var i=0; i<response.data.allExpense.length; i++) {
            await showNewExpenseOnScreen(response.data.allExpense[i])
        }
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
        let response = await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`)
        await removeExpenseFromScreen(expenseId);
    } catch(err) {
        console.log(err);
    }
}

const removeExpenseFromScreen = async (expenseId) => {
    const parentNode = document.getElementById('listOfExpenses');
    const elem = document.getElementById(expenseId);
    parentNode.removeChild(elem);
}
window.addEventListener("DOMContentLoaded", display);