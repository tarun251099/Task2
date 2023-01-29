const express = require('express');
const BodyParser = require('body-parser');
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { config } = require('dotenv');
config();
const User = require("./models/User");
const Question = require("./models/Question")
const Answer = require("./models/Answer")
const Comment = require("./models/Comment")

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@trialcluster.njt2dkg.mongodb.net/task2`;
console.log(`Conecting to ${url}...`);
mongoose
    .connect(url, { useNewUrlParser: true })
    .then(() => {
        const app = express()
        app.use(BodyParser.json());
        app.use(BodyParser.urlencoded({ extended: true }));

        app.post("/user", async function (req, res) {
            const user = req.body;
            const createdUser = await User.create(user);
            res.status(201).json(createdUser);
        });
        app.post("/question", async function (req, res) {
            const question = req.body;
            const createdQuestion = await Question.create(question);
            res.status(201).json(createdQuestion);
        });
        app.post("/question/:quesId/answer", async function (req, res) {
            const answer = req.body;
            const { quesId } = req.params;
            const createdAnswer = await Answer.create(answer);
            res.status(201).json(createdAnswer);
            const answerId = createdAnswer._id;
            const bind = await Question.findByIdAndUpdate(quesId, { $push: { ans: answerId } });
        });
        app.post("/answer/:ansId/comment", async function (req, res) {
            const comment = req.body;
            const { ansId } = req.params;
            const createdComment = await Comment.create(comment);
            res.status(201).json(createdComment);
            const commentId = createdComment._id;
            const bind = await Answer.findByIdAndUpdate(ansId, { $push: { comment: commentId } });

        });
        app.put("/question/:quesId/like", async function (req, res) {
            const { quesId } = req.params;
            const like = await Question.findByIdAndUpdate(quesId, { $inc: { likes: 1 } });
            res.status(200).json("Liked");
        });
        app.put("/question/:quesId/dislike", async function (req, res) {
            const { quesId } = req.params;
            const like = await Question.findByIdAndUpdate(quesId, { $inc: { dislikes: 1 } });
            res.status(200).json("Disliked");
        });
        app.put("/answer/:ansId/like", async function (req, res) {
            const { ansId } = req.params;
            const like = await Answer.findByIdAndUpdate(ansId, { $inc: { dislikes: 1 } });
            res.status(200).json("Liked");
        });
        app.put("/answer/:ansId/dislike", async function (req, res) {
            const { ansId } = req.params;
            const like = await Question.findByIdAndUpdate(ansId, { $inc: { dislikes: 1 } });
            res.status(200).json("Disliked");
        });
        app.get("/user", async function (req, res) {
            const userId = req.query.id;
            const user = await User.findById(userId);
            res.status(200).json(user);
        })
        app.get("/question", async function (req, res) {
            const question = await Question.find({});
            res.status(200).json(question);
        })
        app.get("/question/:quesId/answer", async function (req, res) {
            const { quesId } = req.params;
            const answers = await Question.aggregate([{ $match: { _id: ObjectId(quesId) } }, { $lookup: { from: "answers", localField: "ans", foreignField: "_id", as: "answers" } }, { $project: { answers: 1, _id: 0 } }]);
            res.status(200).json(answers);
        })
        app.get("/answer/:ansId/comment", async function (req, res) {
            const { ansId } = req.params;
            const comments = await Answer.aggregate([{ $match: { _id: ObjectId(ansId) } }, { $lookup: { from: "comments", localField: "comment", foreignField: "_id", as: "comments" } }, { $project: { comments: 1, _id: 0 } }]);
            res.status(200).json(comments);
        })
        app.get("/question/:quesId/likeDislike", async function (req, res) {
            const { quesId } = req.params;
            const question = await Question.findById(quesId).select({ likes: 1, dislikes: 1 });
            res.status(200).json(question);
        })
        app.get("/answer/:ansId/likeDislike", async function (req, res) {
            const { ansId } = req.params;
            const answer = await Answer.findById(ansId).select({ likes: 1, dislikes: 1 });
            res.status(200).json(answer);
        })
        app.get("/question/:quesId/answerCount", async function (req, res) {
            const { quesId } = req.params;
            const answerCount = await Question.aggregate([{$match: {_id: ObjectId(quesId)}}, {$project: {ansCount: {$size: "$ans"}}}]);
            res.status(200).json(answerCount);
        })
        app.get("/answer/:ansId/commentCount", async function (req, res) {
            const { ansId } = req.params;
            const commentCount = await Answer.aggregate([{$match: {_id: ObjectId(ansId)}}, {$project: {commentCount: {$size: "$comment"}}}]);
            res.status(200).json(commentCount);
        })
        app.get("/answer", async function (req, res) {
            const answers = await Answer.find({}).sort({ likes: -1 });
            res.status(200).json(answers);
        })

        app.listen(3001, () => {
            console.log("Server has started on 3001!")
        })

    })