const mongoose = require('mongoose');
const attendanceSchema = mongoose.Schema({
    studentId: {
        type: String,
        required: 'Please Enter students ID'
    },
    courseId: { type: String, required: 'Please Enter course ID' },
    lectureNumber: { type: Number, enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], required: 'Please Enter grade type' },
    Date: { type: Date, default: Date.now() },
    time: { type: Date, default: Date.now() },
    status: { type: Boolean, default: false }
});
module.exports = mongoose.model('attendance', attendanceSchema);