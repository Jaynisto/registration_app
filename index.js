const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const db = require("./database/connection")
const factoryFunction = require("./database/factoryFunction");

const app = express()

let sendOrGetData = factoryFunction(db)

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');
app.use(express.static("public"));

app.use(session({
    secret : 'codeforgeek',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


app.get('/', async (req,res)=>{
    res.render("index", {
        registration : await sendOrGetData.displayingRegNums(),
    });
    
});

app.post('/insertReg', async (req,res)=>{
    const {regNumber} = req.body;
    let regNumbers = regNumber.toUpperCase();
    var regEx = /[CY|CJ|CA]{2}(\s)[0-9]{3}(\s|\-)[0-9]{3}/gi
    const isWC = regEx.test(regNumbers);
    if(isWC === true){
        const theReg = regNumbers.substring(0,2);
        
        const selectId = await sendOrGetData.gettingTownID(theReg)
        await sendOrGetData.storingUserRegistration(regNumbers,selectId);
        
    }else if (isWC === false){
        req.flash('erro', 'Invalid registration Number');
    }

    res.redirect("/");
});

app.post('/filtering', async (req,res)=>{
    const {town} = req.body;
    const registrations = await sendOrGetData.getRegByTown(town)
    console.log(registrations)
    res.redirect("/")
});

app.get('/clear', async (req,res)=>{
    await sendOrGetData.clearingReg();
    req.flash('erro', 'Registration numbers Deleted');
    res.redirect("/")
})

const PORT = process.env.PORT || 2025;

app.listen(PORT, (req,res)=>{
    console.log("App Started On Port " + PORT);
});
