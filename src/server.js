require('dotenv').config();
const express = require('express');
const cors = require("cors");
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const sessionMiddleware = require('./middleware/session');


const app = express();
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;

configViewEngine(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// khai báo middleware session
app.use(sessionMiddleware);

// khai báo đường dẫn
app.use('/',webRoutes);

// make sure shit work!!!
app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})