const express = require("express");
const Notice = require("../models/notice");
const noticeRouter = express.Router();

// 공지사항 등록하기 관리자가 사용하는 API admin 토큰이 필요함!!!
noticeRouter.post("/add-notice", async (req, res) => {
  try {
    const { title, contentHTML, date } = req.body;
    let notice = new Notice({
      title,
      contentHTML,
      date: new Date().getTime(),
    });
    notice = await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

// 공지사항 가져오기
noticeRouter.get("/get-notice", async (req, res) => {
  try {
    const notices = await Notice.find({});

    // 내림 차순 (최신순)
    notices.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else if (a.date < b.date) {
        return 1;
      } else {
        return 0;
      }
    });

    // console.log(notices);
    res.json(notices);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

module.exports = noticeRouter;
