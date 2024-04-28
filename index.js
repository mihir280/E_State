const express=require('express');
const path=require('path');
const bcrypt=require('bcrypt');
const collection=require('./config');

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static('public'));

app.set('view engine','ejs');



app.get('/',(req,res)=>{
    res.render('login');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.post('/signup',async(req,res)=>{
    const data={
        name: req.body.username,
        password: req.body.password
    }
    const existinguser=await collection.findOne({name:data.name});
    if(existinguser){
        return res.send("user already exists");
    }else{
        const salt=10;
        const hashedpassword=await bcrypt.hash(data.password,salt);
        data.password=hashedpassword;
    
    
        const userdata= await collection.insertMany(data);
        console.log(userdata);

    }
    
   

});

app.post('/login',async(req,res)=>{
    try{
        const check=await collection.findOne({name:req.body.username});
        if(!check){
            res.send("user not found");
        }

        const ispassword=await bcrypt.compare(req.body.password, check.password);
        if(ispassword){
            res.render('home');
        }
        else{
            res.send("wrong password");
        }

    }
    catch(err){
        res.send("error");
    }

});

app.get('/home', (req, res) => {
    res.render('home'); // Assumes you have a file named home.ejs in your views directory
});


const port=5002;
app.listen(port,()=>{
    console.log(`listening to port: ${port}`);
});