module.exports = (req, res, next) => {
  if (req.path === "/login" && req.method === "POST") {
    const { username, password } = req.body;
    if (username === "vansir" && password === "123456") {
      return res.status(200).json({
        user: {
          token: "123",
        },
      });
    } else {
      return res.status(400).json({ message: "用户名或密码错误" });
    }
  }
  next();
};
