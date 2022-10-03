const express = require("express")
const app = express()
const bp = require("body-parser")
const qr = require("qrcode")

app.set("view engine", "ejs");
app.use(bp.urlencoded({extended: false}))
app.use(bp.json());


app.get("/", (req, res)=>{
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

const port = 5000;
app.listen(port, ()=>{
    console.log("Server at 5000");
})