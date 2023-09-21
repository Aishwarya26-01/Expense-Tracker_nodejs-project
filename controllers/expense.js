const Expense = require('../models/expense');
const User = require('../models/user');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    } else {
        return false
    }
}

const addExpense = async (req, res) => {
    try{
        const { expenseAmount, expenseDesc, expenseCategory } = req.body;
        if(isstringinvalid(expenseAmount)){
            return res.status(400).json({ success: false, message: 'Parameters missing' })
        }
        const expense = await Expense.create({ expenseAmount, expenseDesc, expenseCategory, userId: req.user.id })
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseAmount);
        User.update({totalExpenses: totalExpense}, {where: {id: req.user.id}})

        res.status(201).json({ expense: expense });
    }catch(err) {
        res.status(500).json({succes: false, error: err});
    }
}

const getExpense = async (req, res) => {
    try{
        const expenses = await Expense.findAll({ where: {userId: req.user.id} });
        res.status(200).json({ expenses, success: true });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: err, success: false });
    }
}

const deleteExpense = async (req, res) => {
    try{
        const expenseId = req.params.expenseid;
        if(isstringinvalid(expenseId)) {
            return res.status(400).json({success: false});
        }
        const noOfRows = await Expense.destroy({ where: {id: expenseId, userId: req.user.id} });
        if(noOfRows === 0) {
            return res.status(404).json({success: false, message: 'Expense does not belongs to user'})
        }
        return res.status(200).json({ success: true, message: 'Deleted successfully'})
    } catch(err) {
        console.log(err)
        return res.status(500).json({ success: true, message: 'Failed' });
    }
}

module.exports = {
    addExpense, 
    getExpense, 
    deleteExpense
}