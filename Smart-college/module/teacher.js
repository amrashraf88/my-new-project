const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const teacherSchema=mongoose.Schema({
    _id:{type:String,required:'please enter id'},
    type: { type: String, default: 'teacher',required:true },
    name: { type: String,required:'Please Enter Teacher Name'},
    email: { type: String,required:'Please Enter Teacher Email'},
    password: { type: String,required:'Please Enter Teacher Password',min:8},
    created_at: { type: Date, default: Date.now() },
    courses:[String]
});

teacherSchema.pre('save',function(next){
    var teacher=this;
    if(teacher.isModified('password')){
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err);

            bcrypt.hash(teacher.password,salt,function(err,hash){
               if(err) return next(err);
               teacher.password=hash;
               next(); 
            })
        })
    }
    else{
        next();
    }
});

// studentSchema.methods.comparePassword=function(candidatePassword,checkpassword){

//     bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
//         if(err) {
//             return checkpassword(err)
//         };
//         return checkpassword(null,isMatch)
//     });
// };

module.exports=mongoose.model('teacher',teacherSchema);