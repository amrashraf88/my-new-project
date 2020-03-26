let express=require('express');
let app=express();
let bodyparser=require('body-parser');
require('./db.js');

let adminRouter=require('./route/admin');



let cors=require('cors');
var session = require('express-session')
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))



app.use('/admin',adminRouter);






app.listen(5000,()=>console.log('Welcome To smart-college Project'));

