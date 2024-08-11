let express = require('express');
let route = express.Router();
let userModel = require('../model/userModel');
let conection = require('../db/connection')
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let auth = require('../middleWare/auth');
const rotineModel = require('../model/ClassRotin');


route.get('/', (req, res) => {
    res.json({ mess: 'server start', status: 200 })
})
route.post('/signup', async (req, res) => {
    try {
        let payload = req.body;
        if (payload.password !== payload.cpassword) {
            throw new Error('password not match');

        }
        let exsistUser = await userModel.findOne({ email: payload.email });

        if (exsistUser != null) {
            throw new Error('email already login/signup');
        }
        let user = new userModel(payload);

        const solt = bcrypt.genSaltSync(10);
        let BcriptPassword = await bcrypt.hashSync(user.password, solt);
        let BcriptCpassword = await bcrypt.hashSync(user.cpassword, solt);
        if (!BcriptPassword || !BcriptCpassword) {
            throw new Error('bcript pass not gen')
        }
        user.password = BcriptPassword;
        user.cpassword = BcriptCpassword;
        let data = await user.save();
        res.json({
            mess: 'signup  success',
            status: 201,
            data: data,
            success: true,
            error: false
        })
    }
    catch (e) {
        res.json({ mess: 'signup not success', status: 401, success: false, error: true })

    }
})


route.post('/login', async (req, res) => {
    try {
        let payload = req.body;
        let exsistUser = await userModel.findOne({ email: payload.email });

        if (!exsistUser) {
            throw new Error('email already login/signup');
        }
        let isMatch = await bcrypt.compare(payload.password, exsistUser.password);
        if (isMatch) {
            let tokon = jwt.sign({ _id: exsistUser._id },'y32y2bcc83vvchcyklacvznutrkjBcggvcvDCCd', { expiresIn: '3d' });
            res.cookie('jwt', tokon, { maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });

            res.json({
                mess: 'login success',
                status: 201,
                success: true,
                error: false
            })
        }
        else {
            throw new Error('login not succesfull');
        }
    }
    catch (e) {
        res.json({ mess: 'login not success', status: 401, success: false, error: true })

    }
})

// to get auth userDetail
route.get('/user-Detail', auth, async (req, res) => {
    try {
        let data = req.user;


        res.json({ mess: 'login not success', data: data, status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'login not success', status: 401, success: false, error: true })

    }
})

// show all student

route.get('/all-student', async (req, res) => {
    try {
        let data = await userModel.find({ role: 'Student' })

        res.json({ mess: 'login not success', data: data, status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'login not success', status: 401, success: false, error: true })

    }
})

// show all teacher

route.get('/all-teacher', async (req, res) => {
    try {
        let data = await userModel.find({ role: 'Teacher' })

        res.json({ mess: 'login not success', data: data, status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'login not success', status: 401, success: false, error: true })

    }
})

// show single student by id

route.get('/student-Id/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let data = await userModel.findOne({ _id: id })

        res.json({ mess: 'login not success', data: data, status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'login not success', status: 401, success: false, error: true })

    }
})


// show single teacher by id

route.get('/teacher-Id/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let data = await userModel.findOne({ _id: id })
        console.log(id)
        res.json({ mess: 'login not success', data: data, status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'login not success', status: 401, success: false, error: true })

    }
})



// Add single teacher by id

route.put('/teacher-Id/:id', async (req, res) => {
    try {
        let payload = req.body;
        let id = req.params.id;

        let user = await userModel.findById(id);
        if (!user) {
            return res.status(401).json({ mess: 'Teacher not authorized', success: false, error: true });
        }

        user.teacher = payload;
        console.log(user)
        let data = await userModel.findByIdAndUpdate({ _id: id }, { teacher: payload }, { new: true });

        res.json({ mess: 'Update successful', data: data, status: 200, success: true, error: false });

    } catch (e) {
        res.status(500).json({ mess: 'Update not successful', status: 500, success: false, error: true });
    }
});


// Add single student by id

route.put('/students-Id/:id', async (req, res) => {
    try {
        let payload = req.body;
        let id = req.params.id;

        let user = await userModel.findById(id);
        if (!user) {
            return res.status(401).json({ mess: 'Teacher not authorized', success: false, error: true });
        }

        user.student = payload;
        // Save the updated user object
        let data = await userModel.findByIdAndUpdate(id, { student: payload }, { new: true });

        res.json({ mess: 'Update successful', data: data, status: 200, success: true, error: false });

    } catch (e) {
        res.status(500).json({ mess: 'Update not successful', status: 500, success: false, error: true });
    }
});

// delete student detail
route.delete('/delete-student/:id', async (req, res) => {
    try {

        let id = req.params.id;
        let data = await userModel.findByIdAndDelete({ _id: id })
        res.json({ mess: 'delete not success', status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'delete not success', status: 401, success: false, error: true })

    }
})

// show all class details
route.post('/add-class', async (req, res) => {
    try {
        let payload = req.body;
        console.log(payload)

        let user = await rotineModel.findOne({
            $and: [
                { teacherName: payload.teacherName },
                { start: payload.start }
            ]
        });
        console.log(user);
        
        if (user) {
            return res.status(401).json({ mess: 'Teacher not authorized', success: false, error: true });
        }

        let result = new rotineModel(payload);
        let data = await result.save();

        res.json({ mess: 'class add successful', data: data, status: 200, success: true, error: false });

    } catch (e) {
        res.status(500).json({ mess: 'class add not successful', status: 500, success: false, error: true });
    }
});



// show all class rotin

route.get('/all-class', async (req, res) => {
    try {
        let data = await rotineModel.find();
        res.json({ mess: 'login not success', data: data, status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'login not success', status: 401, success: false, error: true })

    }
})
 
// show only class rotin
route.get('/classDetils/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let data = await rotineModel.findById({ _id: id })
               res.json({ mess: 'login not success', data: data, status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'login not success', status: 401, success: false, error: true })

    }
})


// show Edit class rotin
route.put('/classDetils-edit/:id', async (req, res) => {
    try {
         let id = req.params.id;
        let payload=req.body;
 
        //  let result = await rotineModel.findById({_id:id})
        // if(!result){
        //     throw new Error ('classtime not present');
        // }
        let data=await  rotineModel.findByIdAndUpdate({_id:id},payload,{new:true});
        console.log(data)
               res.json({ mess: 'class edit success', data: data, status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'class udatee not success', status: 401, success: false, error: true })

    }
})



//detele class details
 route.delete('/delete-class/:id', async (req, res) => {
    try {

         let id = req.params.id;
        let data = await rotineModel.findByIdAndDelete({ _id: id })
        res.json({ mess: 'delete not success', status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'delete not success', status: 401, success: false, error: true })

    }
})

// show principle assign class
 
route.get('/principle-assign-class/:mobileNo',auth, async (req, res) => {
    try {
        let mobileNo=req.params.mobileNo;
          let data = await rotineModel.find( {mobileNo:mobileNo })
               res.json({ mess: 'login not success', data: data, status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'login not success', status: 401, success: false, error: true })

    }
})

route.delete('/logout', async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.json({ mess: 'logout   success', status: 200, success: true, error: false })

    }
    catch (e) {
        res.json({ mess: 'logout not success', status: 401, success: false, error: true })

    }
})








module.exports = route;