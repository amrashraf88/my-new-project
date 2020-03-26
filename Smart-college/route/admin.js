let express = require('express');
let router = express.Router();
let adminService = require('../service/admin');
const studentModel = require('../module/student');
const teacherModel = require('../module/teacher')
const gradeModel = require('../module/grade');
const courseModel = require('../module/course');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

// ------------------------Student Routes ----------------------------------------
/**
 * @method - GET
 * @description - Get All Students
 * @param - /students/view/students
 */

router.get('/view/students', (req, res) => {
    adminService.getAllStudents().then((students) => {
        if (students) {
            res.json(students);
        }
        else {
            res.status(404).json({ msg: 'No Students Yet' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});

/**
 * @method - GET
 * @description - Get Student by id
 * @param - /students/view/student
 */

router.get('/view/studentbyid', (req, res) => {
    let id = req.body._id;
    adminService.getStudentById(id).then((student) => {
        if (student) {
            res.json(student);
        }
        else {
            res.status(404).json({ msg: 'Student Not Found' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});

/**
 * @method - GET
 * @description - Get Student by name
 * @param - /students/view/student
 */

router.get('/view/studentbyname', (req, res) => {
    let name = req.body.name;
    adminService.getStudentByName(name).then((student) => {
        if (student) {
            res.json(student);
        }
        else {
            res.status(404).json({ msg: 'Student Not Found' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});


/**
 * @method - POST
 * @description - Add New Student
 * @param - /students/addstudent
 */
router.post(
    "/addstudent",
    [
        check("_id", "Please Enter a Valid ID")
            .not()
            .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 8
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const student = req.body;
        email = student.email;
        id = req.body._id;
        try {
            let user = await studentModel.findOne({
                _id: id
            });
            let user2 = await studentModel.findOne({
                email
            });
            if (user || user2) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }
            else {
                adminService.addStudent(student).then((student) => {
                    if (student) {
                        res.json({ msg: 'Student Added Successfuly' });
                        res.json(student);
                    }
                    else {
                        res.status(404).json({ msg: "Can't Add This Students" });
                    }
                }).catch(err => {
                    Console.log(err);
                    res.status(500).json({ msg: 'Internal Server Error' });
                })
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);




/**
 * @method - PUT
 * @description - Update Student By Id
 * @param - /students/updatestudent
 */
router.put('/updatestudent', (req, res) => {
    let id = req.body._id;
    studentModel.findOneAndUpdate({ _id: id },
        req.body,
        { useFindAndModify: false },
        (err) => {
            if (err) {
                res.status(404).json({ msg: "Can't Update this Student Information" });
            }
            res.status(201).json({ msg: "Student's Information Updated Successfuly" });
        });
});

/**
 * @method - DELETE
 * @description - Delete Student By Id
 * @param - /students/deletestudent
 */
router.delete('/deletestudent', (req, res) => {
    let id = req.body._id;
    if (adminService.getStudentById(id)) {
        adminService.deleteStudent(id).then((student) => {
            if (student) {
                res.status(201).json({ msg: 'Student Deleted Successfuly' });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        });
    }
    else {
        res.status(404).json({ msg: "Student Not Found" });
    }
});



/**
 * @method - PUT
 * @description - update grades for specific course to student
 * @param - /students/update/grade
 */
router.put('/update/grade', (req, res) => {
    let courseCode = req.body.courseId;
    let studentId = req.body.studentId;
    gradeModel.findOneAndUpdate({ studentId: studentId, courseId: courseCode },
        req.body,
        { useFindAndModify: false },
        (err) => {
            if (err) {
                res.status(404).json({ msg: "Can't Update this Student Information" });
            }
            res.status(201).json({ msg: "Student's Grade Updated Successfuly" });
        });
});

/**
 * @method - DELETE
 * @description - delete course for student
 * @param - /students/delete/student/course
 */
router.delete('/delete/student/course', (req, res) => {
    let courseCode = req.body.courseCode;
    let id = req.body._id;
    if (adminService.getStudentById(id)) {

        if (adminService.getCourseByCode(courseCode)) {

            adminService.deleteCourseForStudent(id, courseCode).then((course) => {
                if (course) {
                    res.status(201).json({ msg: 'Course Deleted Successfuly from this Student' });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).json({ msg: "Internal Server Error" });
            });
        }
        else {
            res.status(404).json({ msg: "course Not Found" });
        }

    }
    else {
        res.status(404).json({ msg: "Student Not Found" });
    }
});



/**
 * @method - GET
 * @description - Get Students in specific course
 * @param - /students/view/student
 */
router.get('/view/students/course', (req, res) => {
    let courseCode = req.body.corseCode;
    let students
    if (adminService.getCourseByCode(courseCode)) {
        adminService.getStudentsInSpecificCourse(courseCode).then((students) => {
            if (students) {
                res.json(students);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        });
    }
    else {
        res.status(404).json({ msg: "Course Not Found" });
    }
});


/**
 * @method - GET
 * @description - Get Student courses
 * @param - /students/view/student/courses
 */
router.get('/view/student/courses', (req, res) => {
    let id = req.body._id;
    if (adminService.getStudentById(id)) {
        adminService.getStudentCourses(id).then((courses) => {
            if (courses) {
                res.json(courses);
            }
            else {
                res.status(500).json({ msg: "No Courses For This Student" });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        });
    }
    else {
        res.status(404).json({ msg: "Student Not Found" });
    }
});


// ------------------------Teacher Routes ----------------------------------------
/**
 * @method - GET
 * @description - Get All Teachers
 * @param - /students/view/teachers
 */

router.get('/view/teachers', (req, res) => {
    adminService.getAllTeachers().then((teachers) => {
        if (teachers) {
            res.json(teachers);
        }
        else {
            res.status(404).json({ msg: 'No Teachers Yet' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});

/**
 * @method - GET
 * @description - Get Teacher by id
 * @param - /students/view/teacher
 */

router.get('/view/teacherbyid', (req, res) => {
    let id = req.body._id;
    adminService.getTeacherById(id).then((teacher) => {
        if (teacher) {
            res.json(teacher);
        }
        else {
            res.status(404).json({ msg: 'Teacher Not Found' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});

/**
 * @method - GET
 * @description - Get Teacher by name
 * @param - /students/view/teacher
 */

router.get('/view/teacherbyname', (req, res) => {
    let name = req.body.name;
    adminService.getTeacherByName(name).then((teacher) => {
        if (teacher) {
            res.json(teacher);
        }
        else {
            res.status(404).json({ msg: 'Teacher Not Found' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});


/**
 * @method - POST
 * @description - Add New Teacher
 * @param - /students/addteacher
 */
router.post(
    "/addteacher",
    [
        check("_id", "Please Enter a Valid ID")
            .not()
            .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 8
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const teacher = req.body;
        email = teacher.email;
        id = req.body._id;
        try {
            let user = await teacherModel.findOne({
                _id: id
            });
            let user2 = await teacherModel.findOne({
                email
            });
            if (user || user2) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }
            else {
                adminService.addTeacher(teacher).then((teacher) => {
                    if (teacher) {
                        res.json({ msg: 'Teacher Added Successfuly' });
                        res.json(teacher);
                    }
                    else {
                        res.status(404).json({ msg: 'Teacher Not Found' });
                    }
                }).catch(err => {
                    Console.log(err);
                    res.status(500).json({ msg: 'Internal Server Error' });
                })
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);




/**
 * @method - PUT
 * @description - Update Teacher By Id
 * @param - /students/updateteacher
 */
router.put('/updateteacher', (req, res) => {
    let id = req.body._id;
    teacherModel.findOneAndUpdate({ _id: id },
        req.body,
        { useFindAndModify: false },
        (err) => {
            if (err) {
                res.status(404).json({ msg: "Can't Update this Teacher Information" });
            }
            res.status(201).json({ msg: "Teacher's Information Updated Successfuly" });
        });
});

/**
 * @method - DELETE
 * @description - Delete Teacher By Id
 * @param - /students/deleteteacher
 */
router.delete('/deleteteacher', (req, res) => {
    let id = req.body._id;
    if (adminService.getTeacherById(id)) {
        adminService.deleteTeacher(id).then((student) => {
            if (student) {
                res.status(201).json({ msg: 'Teacher Deleted Successfuly' });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        });
    }
    else {
        res.status(404).json({ msg: "Teacher Not Found" });
    }
});

/**
 * @method - DELETE
 * @description - delete course for teacher
 * @param - /students/delete/teacher/course
 */
router.delete('/delete/teacher/course', (req, res) => {
    let courseCode = req.body.courseCode;
    let id = req.body._id;
    if (adminService.getTeacherById(id)) {

        if (adminService.getCourseByCode(courseCode)) {

            adminService.deleteCourseForTeacher(id, courseCode).then((course) => {
                if (course) {
                    res.status(201).json({ msg: 'Course Deleted Successfuly for this Teacher' });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).json({ msg: "Internal Server Error" });
            });
        }
        else {
            res.status(404).json({ msg: "course Not Found" });
        }

    }
    else {
        res.status(404).json({ msg: "Student Not Found" });
    }
});




/**
 * @method - GET
 * @description - Get Teachers in specific course
 * @param - /students/view/teachers/course
 */
router.get('/view/teachers/course', (req, res) => {
    let courseCode = req.body.courseCode;
    if (adminService.getCourseByCode(courseCode)) {
        adminService.getTeacherInSpecificCourse(courseCode).then((teachers) => {
            if (teachers) {
                res.json(teachers);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        });
    }
    else {
        res.status(404).json({ msg: "Course Not Found" });
    }
});


/**
 * @method - GET
 * @description - Get Teacher courses
 * @param - /students/view/teacher/courses
 */
router.get('/view/teacher/courses', (req, res) => {
    let id = req.body._id;
    if (adminService.getTeacherById(id)) {
        adminService.getTeacherCourses(id).then((courses) => {
            if (courses) {
                res.json(courses);
            }
            else {
                res.status(500).json({ msg: "Teacher Not Found" });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        });
    }

});



// ------------------------Course Routes ----------------------------------------
/**
 * @method - GET
 * @description - Get All Courses
 * @param - /students/view/courses
 */

router.get('/view/courses', (req, res) => {
    adminService.getAllCourses().then((courses) => {
        if (courses) {
            res.json(courses);
        }
        else {
            res.status(404).json({ msg: 'No Courses Yet' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});

/**
 * @method - GET
 * @description - Get Course by code
 * @param - /students/view/course
 */

router.get('/view/coursebyid', (req, res) => {
    let code = req.body.courseCode;
    adminService.getCourseByCode(code).then((course) => {
        if (course) {
            res.json(course);
        }
        else {
            res.status(404).json({ msg: 'Student Not Found' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});

/**
 * @method - GET
 * @description - Get Course by name
 * @param - /students/view/course
 */

router.get('/view/coursebyname', (req, res) => {
    let name = req.body.courseName;
    adminService.getCourseByName(name).then((course) => {
        if (course) {
            res.json(course);
        }
        else {
            res.status(404).json({ msg: 'Student Not Found' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});

/**
 * @method - POST
 * @description - Add New Course
 * @param - /students/addcourse
 */
router.post(
    "/addcourse",
    [
        check("courseCode", "Please Enter a Valid Code")
            .not()
            .isEmpty(),
        check("courseName", "Please Enter a Valid Name")
            .not()
            .isEmpty(),
        check("courseDepartment", "Please Enter a Valid Department")
            .not()
            .isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const course = req.body;
        code = course.courseCode;
        name = req.body.courseName;
        try {
            let user = await courseModel.findOne({
                courseCode: code
            });
            let user2 = await courseModel.findOne({
                courseName: name
            });
            if (user || user2) {
                return res.status(400).json({
                    msg: "Course Already Exists"
                });
            }
            else {
                adminService.addCourse(course).then((course) => {
                    if (course) {
                        res.json({ msg: 'Course Added Successfuly' });
                        res.json(course);
                    }
                    else {
                        res.status(404).json({ msg: "Can't add this Course" });
                    }
                }).catch(err => {
                    Console.log(err);
                    res.status(500).json({ msg: 'Internal Server Error' });
                })
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);




/**
 * @method - PUT
 * @description - Update Course By Course Code
 * @param - /students/updatecourse
 */
router.put('/updatecourse', (req, res) => {
    let code = req.body.courseCode;
    adminService.getCourseByCode(code).then((course) => {
        if (course) {
            courseModel.findOneAndUpdate({ courseCode: code },
                req.body,
                { useFindAndModify: false },
                (err) => {
                    if (err) {
                        res.status(404).json({ msg: "Can't Update this Course Information" });
                    }
                    res.status(201).json({ msg: "Course's Information Updated Successfuly" });
                });
        }
        else {
            res.status(404).json({ msg: 'Course Not Found' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })

});

/**
 * @method - DELETE
 * @description - Delete Course By Id
 * @param - /students/deletecourse
 */
router.delete('/deletecourse', (req, res) => {
    let code = req.body.courseCode;
    if (adminService.getCourseByCode(code)) {
        adminService.deleteCourse(code).then((course) => {
            if (course) {
                res.status(201).json({ msg: 'Course Deleted Successfuly' });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        });
    }
    else {
        res.status(404).json({ msg: "Course Not Found" });
    }

});


/**
 * @method - GET
 * @description - Get grades for specific course
 * @param - /students/view/grades
 */

router.get('/view/grades', (req, res) => {
    let courseCode = req.body.courseId;
    adminService.getGradesForSpecificCourse(courseCode).then((grades) => {
        if (grades) {
            res.json(grades);
        }
        else {
            res.status(404).json({ msg: 'No Grades For This Course Yet' });
        }
    }).catch(err => {
        Console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
});


/**
 * @method - POST
 * @description - ADD Grade 
 * @param - /students/addgrade
 */
router.post(
    "/addgrade",
    [
        check("studentId", "Please Enter a Valid Student ID")
            .not()
            .isEmpty(),
        check("courseId", "Please Enter a Valid Course ID")
            .not()
            .isEmpty(),
        check("gradeType", "Please Enter a Valid Grade Type")
            .not()
            .isEmpty(),
        check("score", "Please Enter a Valid Grade")
            .not()
            .isEmpty(),


    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const grade = req.body;
        const studentId = grade.studentId;
        const courseId = grade.courseId;
        const gradeType = grade.gradeType;
        // const score=grade.score;

        try {
            let checkStudentId = await gradeModel.findOne({
                studentId: studentId
            });
            let checkCourseId = await gradeModel.findOne({
                courseId: courseId
            });
            let checkGradeType = await gradeModel.findOne({
                gradeType: gradeType
            });

            if (checkStudentId && checkCourseId && checkGradeType) {
                return res.status(400).json({
                    msg: "Grade Already Exists"
                });
            }
            else {
                adminService.addGrade(grade).then((grade) => {
                    if (grade) {
                        res.json({ msg: 'Grade Added Successfuly' });
                    }
                    else {
                        res.status(404).json({ msg: "Can't Add This Grade" });
                    }
                }).catch(err => {
                    Console.log(err);
                    res.status(500).json({ msg: 'Internal Server Error' });
                })
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);



module.exports = router;