const fakeToday = (req, res, next) => {
    req.today = process.env.TODAY_DEMO
    next();
  };
  
module.exports = fakeToday;
  