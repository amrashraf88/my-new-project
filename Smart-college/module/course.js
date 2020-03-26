const mongoose = require('mongoose');
const courseSchema = mongoose.Schema({
    courseCode: {
        type: String,
        required: 'Please Enter Course Code'
    },
    courseName: { type: String, required: 'Please Enter course Name' },
    courseDepartment: { type: String, enum: ['IS', 'CS', 'IT', 'BIO'], required: 'Please Enter Course Department' },
    grades: [
        {
            type: { type: String},
            grade: { type: String}
        }
    ],

    tasks: [
        {
            type: { type: String },
            path: { type: String }
        }
    ],
    lectures: [
        {
            lectureNumber: { type: Number },
            lectureDate: { type: Date },
            lectureLocation: { type: String },
            lectureTime: { type: Date }

        }
    ]
});
module.exports = mongoose.model('course', courseSchema);