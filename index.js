require('dotenv').config();
let express=require('express');
let app=express();
let cors=require('cors');
let PORT=process.env.PORT || 3000;
let route=require('./route/allRouter');
let userModel=require('./model/userModel');
let conection=require('./db/connection')
let cookie=require('cookie-parser');
app.use(cookie());

 app.use(cors({
    origin: 'http://localhost:3001',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}));

app.use(express.json());

app.use(route);
 
 app.listen(PORT,()=>{
    console.log(`server run ${PORT}`)
 })