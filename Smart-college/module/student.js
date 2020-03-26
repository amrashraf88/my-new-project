const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const studentSchema = mongoose.Schema({
    _id: { type: String, required: 'please enter id' },
    type: { type: String, default: 'student'},
    name: { type: String, required: 'Please Enter Student Name' },
    birth_date: { type: Date, required: 'Please Enter Student Birthdate' },
    email: { type: String, required: 'Please Enter Student Email' },
    password: { type: String, required: 'Please Enter Student Password', min: 8 },
    created_at: { type: Date, default: Date.now() },
    phone: { type: String },
    courses: [String]
});

studentSchema.pre('save', function (next) {
    var student = this;
    if (student.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(student.password, salt, function (err, hash) {
                if (err) return next(err);
                student.password = hash;
                next();
            })
        })
    }
    else {
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

module.exports = mongoose.model('student', studentSchema);