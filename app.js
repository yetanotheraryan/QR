require('dotenv').config()

const express = require("express")
const app = express()
const bp = require("body-parser")
const qr = require("qrcode")
const path = require("path")
const jwt = require("jsonwebtoken")



// settng up the app 
app.set("view engine", "ejs");
app.use(bp.urlencoded({extended: false}))
app.use(bp.json());
app.use(express.static(__dirname + '/public'));



app.get("/", authenticateToken, (req, res)=>{
    
    res.render("index");
})

app.post("/scan", (req, res)=>{
    const url = req.body.url;
    console.log(url)
    if(url.length === 0) res.send("empty data");

    // const generateQR = async text=>{
    //     try{
    //         console.log(await qr)
    //     }
    // }
    qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");
      
        // Let us return the QR code image as our response and set it to be the source used in the webpage
        res.render("scan", { src });
    });
})

// app.post('/login', (req, res) =>{
//     //authenticate user
//     const username = req.body.username
//     const user = {name: username}    
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//     // whenever the user logs in his info is gonna be stored in the access token
//     res.json({accessToken: accessToken})
// })


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    // console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1]   
    // console.log(authHeader.split(" ")[1])
    if(token == null) return res.sendStatus(401)

    // console.log(process.env.ACCESS_TOKEN_SECRET)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401)
        req.user = user
        next()
    })
}


app.listen(process.env.PORT || 5000, ()=>{
    console.log("Server at 5000");
})