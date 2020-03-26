var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/smart-college',
{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Your DB (smart-college) Connected");
});