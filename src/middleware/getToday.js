const fakeToday = (req, res, next) => {
    req.today = new Date(process.env.TODAY_DEMO);
    next();
  };
  
module.exports = fakeToday;
  