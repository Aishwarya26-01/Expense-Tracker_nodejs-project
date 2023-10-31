const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const UserServices = require('../services/userservices');
const S3services = require('../services/S3services');
const DownloadedFile = require('../models/downloadFile');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    } else {
        return false
    }
}

const downloadexpense = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3services.uploadToS3(stringifiedExpenses, filename);

        DownloadedFile.create({
            url: fileURL,
            userId: req.user.id
        })
        res.status(200).json({fileURL, success:true});
    }catch(err){
        console.log(err);
        res.status(500).json({fileURL: '', success: false, err: err});
    }
}

const addExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try{
        const { expenseAmount, expenseDesc, expenseCategory } = req.body;
        if(isstringinvalid(expenseAmount)){
            return res.status(400).json({ success: false, message: 'Parameters missing' })
        }
        const expense = await Expense.create({ expenseAmount, expenseDesc, expenseCategory, userId: req.user.id }, {transaction: t})
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseAmount);
        User.update({totalExpenses: totalExpense}, {where: {id: req.user.id}}, {transaction: t})
        await t.commit();
        res.status(201).json({ expense: expense });
    }catch(err) {
        await t.rollback();
        res.status(500).json({succes: false, error: err});
    }
}

const getExpense = async (req, res) => {
    try{
        const check = req.user.ispremiumuser;
        const page = +req.query.page || 1;
        const pageSize = +req.query.pageSize || 10;
        let totalExpenses = req.user.countExpenses();

        console.log('Aishwaryaaaa');
        const data = await UserServices.getexpenses(req, {
            offset: (page - 1)*pageSize,
            limit: pageSize,
            order: [['id', 'DESC']]
        })
        console.log(data);

        res.status(200).json({
            allExpenses: data,
            check,
            currentPage: page,
            hasNextPage: pageSize*page < totalExpenses,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalExpenses/pageSize)
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: err, success: false });
    }
}

const deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try{
        const expenseId = req.params.expenseid;
        if(isstringinvalid(expenseId)) {
            return res.status(400).json({success: false});
        }
        const expensetobedeleted = await Expense.findAll({
            where: { id: expenseId, userId: req.user.id }, transaction: t
        });

        const totalExpense = Number(req.user.totalExpenses) - Number(expensetobedeleted[0].expenseAmount);
        req.user.totalExpenses = totalExpense;
        await req.user.save({transaction: t});

        const noOfRows = await Expense.destroy({ where: {id: expenseId, userId: req.user.id}, transaction: t });
        if(noOfRows === 0) {
            await t.rollback();
            return res.status(404).json({success: false, message: 'Expense does not belongs to user'})
        }
        await t.commit();
        return res.status(200).json({ success: true, message: 'Deleted successfully'})
    } catch(err) {
        await t.rollback();
        console.log(err)
        return res.status(500).json({ success: true, message: 'Failed' });
    }
}

module.exports = {
    addExpense, 
    getExpense, 
    deleteExpense,
    downloadexpense
}