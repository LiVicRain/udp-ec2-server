const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { signin, auth, checkExistingUser } = require("../middlewares/auth");
const { refreshTokenSecret, accessTokenSecret } = require("../configs/secretkey");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client, deletObjects } = require("../utils/s3Clinet");
const multer = require("multer");

const upload = multer();
const authRouter = express.Router();

// 유저 정보 가져오기
authRouter.get("/", auth, async (req, res) => {
  try {
    const user = await User.getById(req.userId);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
});

// 회원가입 , 로그인
authRouter.post("/auth/sign", checkExistingUser, signin, async (req, res) => {
  try {
    // 클라이언트에서 데이터 가져오기
    const { id, name, email, profile_image, pick_point, gender, birth_date, phone_number, type, login_platform, unique_identifier } = req.body;

    const token = req.token;
    const jwt_refresh_token = token.refreshToken;
    const user = await User.create({ id, name, email, profile_image, pick_point, gender, birth_date, phone_number, type, login_platform, unique_identifier, jwt_refresh_token });
    // 회원가입후 바로 user 리턴
    console.log("회원가입이 완료되었습니다");
    res.json({ token, ...user }); // true 리턴
  } catch (error) {
    console.log("에러 발생");
    res.status(500).json({ err: error.message });
  }
});

// accessToken 재발급
authRouter.post("/auth/token", async (req, res) => {
  try {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.status(401).json({ msg: "refresh token이 없습니다" });

    const verified = jwt.verify(refreshToken, refreshTokenSecret.secretKey);

    // accessToken 발급
    const accessToken = jwt.sign({ sub: verified.sub }, accessTokenSecret.secretKey, accessTokenSecret.options);
    console.log("access Token을 발급받음");
    return res.status(200).json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("refreshToken이 만료되었습니다");
      return res.status(401).json({ msg: "refreshToken이 만료되었습니다" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log("refreshToken이 유효하지 않습니다");
      return res.status(401).json({ msg: "refreshToken이 유효하지 않습니다" });
    }
    return res.status(500).json({ err: `서버 오류 입니다 ${error.message}` });
  }
});

// 유저 정보 수정하기
authRouter.post("/auth/update-profile", auth, async (req, res) => {
  try {
    const user = req.body;
    const isUpdate = await User.updateProfile(req.userId, user);
    // console.log("프로필 업데이트 완료 ", isUpdate);
    return res.status(200).json(isUpdate);
  } catch (error) {
    console.log("프로필 업데이트 오류 ", error);
    return res.status(500).json({ err: `프로필 업데이트 오류 ${error.message}` });
  }
});

// 프로필 이미지 S3 업로드
authRouter.post("/auth/upload-img", auth, upload.single("file"), async (req, res) => {
  try {
    const content = req.file.buffer;
    const now = new Date().getTime().toString();

    deletObjects(process.env.BUCKET, `${req.userId}/`)
      .then(() => console.log("디렉토리가 삭제되었습니다"))
      .catch(error => console.log("디렉토리 삭제에러 발생", error));

    const params = {
      Bucket: process.env.BUCKET,
      Region: process.env.REGION,
      Key: `${req.userId}/${now}.png`,
      Body: content,
      ContentType: "image/png",
      ACL: "public-read",
    };
    const location = `https://${params.Bucket}.s3.${params.Region}.amazonaws.com/${params.Key}`;

    const command = new PutObjectCommand(params);
    s3Client
      .send(command)
      .then(data => {
        console.log(`File uploaded successfully. File location: ${location}`);
      })
      .catch(error => {
        console.log("error 발생 : ", error);
      });
    return res.status(200).json(location);
  } catch (error) {
    console.log(`에러 발생 ${error}`);
    return res.status(500).json({ err: error.message });
  }
});

// 회원 탈퇴
authRouter.delete("/auth/delete", auth, async (req, res) => {
  try {
    const isDelete = await User.delete(req.userId); // 성공하면  true
    if (!isDelete) return res.status(500).json("회원 탈퇴 실패");
    console.log("회원이 탈퇴퇴었습니다");
    return res.status(200).json(isDelete);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ err: `회원 탈퇴 실패 ${error.message}` });
  }
});

module.exports = authRouter;
