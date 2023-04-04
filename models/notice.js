const mongoose = require("mongoose");
const noticeSchema = mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  contentHTML: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: Number,
  },
});

const Notice = mongoose.model("Notice", noticeSchema);
module.exports = Notice;
