const express = require("express");

const authRouter = express.Router();

// 유저 정보 가져오기
authRouter.get("/", async (req, res) => {
  try {
    return res.status(200).json({ msg: "세명이 오리라..." });
  } catch (error) {
    return res.status(200).json({ err: "서버 에러 발생", error });
  }
});
// 유저 정보 가져오기
authRouter.get("/auth", async (req, res) => {
  try {
    return res.status(200).json({ msg: "세명이 오리라..." });
  } catch (error) {
    return res.status(200).json({ err: "서버 에러 발생", error });
  }
});

module.exports = authRouter;
