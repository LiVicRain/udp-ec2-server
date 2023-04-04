const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { accessTokenSecret, refreshTokenSecret } = require("../configs/secretkey");

const checkExistingUser = async (req, res, next) => {
  const { unique_identifier } = req.body;
  const existingUser = await User.getByUniqueIdentifier(unique_identifier);
  if (existingUser) {
    req.existingUser = existingUser;
    console.log("이미 존재하는 유저 입니다");
  }
  next();
};

const signin = async (req, res, next) => {
  if (req.existingUser) {
    const existingUser = req.existingUser;
    try {
      // access Token 발급
      const accessToken = jwt.sign({ sub: existingUser.id }, accessTokenSecret.secretKey, accessTokenSecret.options);
      // refresh Token 발급
      const refreshToken = jwt.sign({ sub: existingUser.id }, refreshTokenSecret.secretKey, refreshTokenSecret.options);
      const updateUser = await User.updateToken(existingUser.id, refreshToken);
      const token = { accessToken, refreshToken };
      console.log("로그인이 완료되었습니다");
      res.status(200).json({ token, ...updateUser });
    } catch (error) {
      console.log("로그인 에러 발생");
      res.status(500).json({ err: error.message });
    }
  } else {
    const { id } = req.body;
    try {
      // access Token 발급
      const accessToken = jwt.sign({ sub: id }, accessTokenSecret.secretKey, accessTokenSecret.options);
      // refresh Token 발급
      const refreshToken = jwt.sign({ sub: id }, refreshTokenSecret.secretKey, refreshTokenSecret.options);
      const token = { accessToken, refreshToken };
      req.token = token;
      next();
    } catch (error) {
      console.log("회원가입 토큰 발급 erorr 발생");
      res.status(500).json({ err: error.message });
    }
  }
};

const auth = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) return res.status(401).json({ msg: "accessToken이 없어 연결이 거부 되었습니다" });
    const verified = jwt.verify(accessToken, accessTokenSecret.secretKey);
    if (!verified) return res.status(401).json({ msg: "accessToken이 유효하지 않습니다" });
    // console.log(accessToken);
    console.log("access 토큰이 유효합니다");
    req.userId = verified.sub;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("accessToken이 토큰이 만료되었습니다");
      return res.status(401).json({ msg: "accessToken이 토큰이 만료되었습니다" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log("accessToken이 유효하지 않습니다");
      return res.status(401).json({ msg: "accessToken이 유효하지 않습니다" });
    }
    console.log(`서버 오류 입니다 ${error.message}`);
    return res.status(500).json({ err: `서버 오류 입니다 ${error.message}` });
  }
};

module.exports = { auth, signin, checkExistingUser };
