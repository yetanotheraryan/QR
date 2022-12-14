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


// completed the video

////////////////////////////////////

let refreshTokens = []


app.post('/token', (req, res)=>{
    const refreshToken = req.body.token
    if (refreshToken == null) return res.send({"err": "token is null"})
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
        if(err){
            // res.sendStatus(403)
            console.log(refreshToken)
            return res.send(err)
        }
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken: accessToken})
    })

})


app.delete('/logout', (req, res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.status(200).send("logout completed successfully")
})


app.post('/login', (req, res) =>{
    //authenticate user
    const username = req.body.username
    const user = {name: username} 
    // console.log(user) 
    const accessToken = generateAccessToken(user)
    // whenever the user logs in his info is gonna be stored in the access token
   
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken: accessToken, refreshToken: refreshToken})
})

 
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
}

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server at 3000");
})