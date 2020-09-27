const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const User = require("./module/User")
const Problem = require("./module/Problem")
const { sendResetLink, sendNotification } = require("./sendEmail");




const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))



const ejs = require('ejs')
app.engine("html", ejs.__express)
app.set("view engine", "html")



// const uri = 'mongodb://127.0.0.1:27017/Group47_DB'
const uri = "mongodb+srv://wx177777:Deakin@cluster0.q8uh0.mongodb.net/Group47?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true })



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
app.get('/about', (req, res) => {
    res.sendFile(__dirname + "/about.html")
})
app.get('/mainPage', (req, res) => {
    res.sendFile(__dirname + "/mainPage.html")
})
app.get('/submitProblem', (req, res) => {
    res.sendFile(__dirname + "/submitProblem.html")
})
app.get('/forgot', (req, res) => {
    res.sendFile(__dirname + "/forgot.html")
})

app.post('/register', (req, res) => {
    console.log(req.body)
    const userName = req.body.userName
    const email = req.body.email
    const password = req.body.password
    const retypedPassword = req.body.retypedPassword
    const carWork = req.body.carWork
    const carModel = req.body.carModel
    const user = new User({
        userName: userName,
        email: email,
        password: password,
        retypedPassword: retypedPassword,
        carWork: carWork,
        carModel: carModel
    })
    user
        .save()
        .catch((err) => console.log(err));
    if (res.statusCode === 200) {
        res.redirect("/mainPage")
    }
})
app.post('/login', (req, res) => {
    var postData = {
        email: req.body.email,
        password: req.body.password
    };

    User.findOne({
        email: postData.email,
    }, function (err, user) {
        if (err) throw err;
        if (user == null) {
            res.send("No matched user!")
        } else {
            user.comparePassword(postData.password, (err, isMatch) => {
                if (err)
                    throw err;
                if (isMatch) {
                    Problem.find({
                        carModel: user.carModel,
                    }, function (err, problems) {
                        if (problems == null || problems.length < 1) {
                            var info = new Array(1)
                            info[0] = {
                                carModel: req.body.carModel,
                                issue: "This model has no issue/recall history"
                            }
                            console.log(info, 1243)
                            res.render("issue", { info: info })
                        } else {
                            res.render("issue", { info: problems })
                        }
                    })
                }
                else {
                    res.send("The password is not correct!")
                }

            })
        }
    })
})
app.post('/submitProblem', (req, res) => {
    const carWork = req.body.carWork
    const carModel = req.body.carModel
    const issue = req.body.issue
    const problem = new Problem({
        carWork: carWork,
        carModel: carModel,
        issue: issue
    })
    problem
        .save()
        .catch((err) => console.log(err));

    if (res.statusCode === 200) {
        User.find({
            carModel: req.body.carModel,
        }, (err, users) => {
            if (users.length > 0) {
                for (let i = 0; i < users.length; i++) {
                    sendNotification(users[0], problem)
                }
            }
        })
        res.redirect("/mainPage")

    }
    console.log(problem)
})
app.post('/findProblem', (req, res) => {
    Problem.find({
        carModel: req.body.carModel,
    }, function (err, problems) {
        if (problems == null || problems.length < 1) {
            var info = new Array(1)
            info[0] = {
                carModel: req.body.carModel,
                issue: "This model has no issue/recall history"
            }
            console.log(info, 1243)
            res.render("issue", { info: info })
        } else {
            res.render("issue", { info: problems })
        }
    })
})

app.route('/users/:id')
    .post((req, res) => {
        if (req.body.password) {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err)
                    return res.send(err);
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err)
                        return next(err);
                    req.body.password = hash;
                    req.body.retypedPassword = hash;
                    Requester.update(
                        { _id: req.params.id },
                        { $set: req.body },
                        (err) => {
                            if (!err) { res.send('Successfully updated! ') }
                            else res.send(err)
                        })
                })
            })
        }
    })


let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, (req, res) => {
    console.log("Server is running successfully!")
})
