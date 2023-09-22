// const sequelize = require("../util/database");
// const UserServices = require("../services/userservices");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Content = require("../models/Content");
const S3Services = require("../services/S3services");

const getExp = async (req, res, next) => {
  try {
    const ITEM_PER_PAGE = Number(req.query.expPerPage);
    const page = Number(req.query.page);
    const totalItems = await Expense.countDocuments({
      userId: req.user._id,
    });
    const expPerPage = await Expense.find({
      userId: req.user._id,
    })
      .skip((page - 1) * ITEM_PER_PAGE)
      .limit(ITEM_PER_PAGE)
      .sort({ _id: -1 });

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
    const { amount, description, category } = req.body;
    const newExp = await Expense.create({
      amount,
      category,
      description,
      userId: req.user._id,
    });
    let totalexp = Number(req.user.totalExp) + Number(amount);
    // console.log("totalexp>>>>>>>>>>>>>>>>>", totalexp);
    await req.user.updateOne({
      totalExp: totalexp,
    });
    res.status(201).json({ newExp, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const delExp = async (req, res, next) => {
  try {
    const expId = req.params.expID;
    // console.log(expId);
    const todelExp = await Expense.findById(expId);

    const totalexp = Number(req.user.totalExp) - Number(todelExp.amount);
    await req.user.updateOne({
      totalExp: totalexp,
    });

    const destroy = await todelExp.deleteOne();
    // console.log(destroy);
    if (destroy === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Expense doesnt belong to User" });
    }

    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const downloadexp = async (req, res, next) => {
  try {
    const userid = req.user._id;
    const expenses = await Expense.find({ userId: userid });
    const stringifiedExp = JSON.stringify(expenses);
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
    const userid = req.user._id;
    const contenturl = await Content.find({ userId: userid });
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
