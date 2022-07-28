
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();
var app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())

app.use("/", router);

router.get('/',(req, res) => {
    res.send("This was sent");
});

router.post('/',(req, res) => {
    var user_name = req.body.user;
    var password = req.body.password;
    console.log("User name = "+user_name+", password is "+password);
    res.end("yes");
});

app.listen(8080,() => {
console.log("Started on PORT 8080");
})
