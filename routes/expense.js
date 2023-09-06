const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense');
const userauthentication = require('../middleware/auth');

router.post('/add-expense', userauthentication.authenticate, expenseController.addExpense);

router.get('/get-expense', userauthentication.authenticate, expenseController.getExpense);

router.delete('/delete-expense/:expenseid', userauthentication.authenticate, expenseController.deleteExpense);

module.exports = router;