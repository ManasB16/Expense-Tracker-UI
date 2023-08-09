const Expense = require("../models/Expense");
const Content = require("../models/Content");
const sequelize = require("../util/database");
const UserServices = require("../services/userservices");
const S3Services = require("../services/S3services");

const getExp = async (req, res, next) => {
  try {
    const ITEM_PER_PAGE = Number(req.query.expPerPage);
    const page = Number(req.query.page);
    const totalItems = await Expense.count({ where: { userId: req.user.id } });
    const expPerPage = await Expense.findAll({
      offset: (page - 1) * ITEM_PER_PAGE,
      limit: ITEM_PER_PAGE,
      where: { userId: req.user.id },
    });

    if (req.user.ispremiumuser == 1) {
      res.status(200).json({
        expenses: expPerPage,
        prevPage: page - 1,
        currPage: page,
        nextPage: Number(page) + 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        ispremiumuser: true,
      });
    } else {
      res.status(200).json({
        expenses: expPerPage,
        prevPage: page - 1,
        currPage: page,
        nextPage: Number(page) + 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        ispremiumuser: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const addExp = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { amount, description, category } = req.body;
    const newExp = await req.user.createExpense(
      {
        amount,
        description,
        category,
      },
      { transaction: t }
    );
    req.user.totalExp += parseInt(amount);
    req.user.update({
      totalExp: req.user.totalExp,
      transaction: t,
    });
    await t.commit();
    res.status(201).json({ newExp, success: true });
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const delExp = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const uId = req.params.expID;
    const todelExp = await Expense.findOne({ where: { id: uId } });

    req.user.totalExp -= todelExp.amount;
    req.user.update({
      totalExp: req.user.totalExp,
      transaction: t,
    });

    const destroy = await Expense.destroy(
      {
        where: { id: uId, userId: req.user.id },
      },
      { transaction: t }
    );
    if (destroy === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Expense doesnt belong to User" });
    }
    await t.commit();
    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({
      error: err,
    });
  }
};

const downloadexp = async (req, res, next) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExp = JSON.stringify(expenses);
    const userid = req.user.id;
    const filename = `Expenses${userid}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExp, filename); // this func will return a url in the end which we will send to front end
    await Content.create({
      filename: filename,
      contenturl: fileURL,
      userId: userid,
    });
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: "", success: false, err: err });
  }
};

const showDownloadedFiles = async (req, res, next) => {
  try {
    const userid = req.user.id;
    const contenturl = await Content.findAll({ where: { userId: userid } });
    res.status(200).json({ contenturl });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

module.exports = {
  getExp,
  addExp,
  delExp,
  downloadexp,
  showDownloadedFiles,
};

