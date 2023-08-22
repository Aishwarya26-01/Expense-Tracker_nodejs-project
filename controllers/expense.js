const express = require('express');
const router = express.Router();

const Expense = require('../models/expense');

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
        if(isstringinvalid(expenseAmount) || isstringinvalid(expenseDesc) || isstringinvalid(expenseCategory)){
            return res.status(400).json({err: "Bad parameters. Something is missing"})
        }
        const data = await Expense.create({ expenseAmount, expenseDesc, expenseCategory });
        console.log(data);
        res.status(201).json({ newExpenseDetail: data });
    }catch(err) {
        res.status(500).json(err);
    }
}

const getExpense = async (req, res) => {
    try{
        const expense = await Expense.findAll();
        res.status(200).json({ allExpense: expense });
    } catch(err) {
        console.log('Get expense is failing', JSON.stringify(err));
        res.status(500).json(err);
    }
}

const deleteExpense = async (req, res) => {
    try{
        if(req.params.id == 'undefined') {
            console.log('Id is missing');
            return res.status(400).json({err: 'Id is missing'});
        }
        const uId = req.params.id;
        await Expense.destroy({ where: {id: uId} });
        res.sendStatus(200);
    } catch(err) {
        res.status(500).json(err);
    }
}

module.exports = {
    addExpense, 
    getExpense, 
    deleteExpense
}