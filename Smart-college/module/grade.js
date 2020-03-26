const mongoose = require('mongoose');
const gradeSchema = mongoose.Schema({
    studentId: {
        type: String,
        required: 'Please Enter students ID'
    },
    courseId: { type: String, required: 'Please Enter course ID' },
    gradeType: { type: String, enum: ['Midterm', 'Quiz 1', 'Quiz 2', 'Quiz 3', 'Project', 'Final'], required: 'Please Enter grade type' },
    score: { type: Number, required: true }

});
module.exports = mongoose.model('grade', gradeSchema);