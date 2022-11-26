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





/////////////////////////////////////

// start https://www.youtube.com/watch?v=mbsmsi7l3r4&t=465s
// start JWT Authentication Tutorial - Node.js | web dev simplified
// at 20:58

////////////////////////////////////










// app.get("/", authenticateToken, (req, res)=>{
    
//     res.render("index");
// })

// app.post("/scan", (req, res)=>{
//     const url = req.body.url;
//     console.log(url)
//     if(url.length === 0) res.send("empty data");

//     // const generateQR = async text=>{
//     //     try{
//     //         console.log(await qr)
//     //     }
//     // }
//     qr.toDataURL(url, (err, src) => {
//         if (err) res.send("Error occured");
      
//         // Let us return the QR code image as our response and set it to be the source used in the webpage
//         res.render("scan", { src });
//     });
// })

app.post('/login', (req, res) =>{
    //authenticate user
    const username = req.body.username
    const user = {name: username} 
    console.log(user) 
    const accessToken = generateAccessToken(user)
    // whenever the user logs in his info is gonna be stored in the access token
   
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    
    res.json({accessToken: accessToken, refreshToken: refreshToken})
})

 
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
}

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server at 3000");
})