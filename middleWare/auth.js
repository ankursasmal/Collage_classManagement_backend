let userModel=require('../model/userModel');
let jwt=require('jsonwebtoken');

async function auth(req,res,next) {
    try{
         let tokon=req.cookies.jwt ;
        let verifiedUser=jwt.verify(tokon,'y32y2bcc83vvchcyklacvznutrkjBcggvcvDCCd');
         let user=await userModel.findOne({_id:verifiedUser._id});
console.log(user)
        req.id=user._id;
        req.user=user;
        req.role=user.role;
        
        next();

    }
    catch(e){
        console.log('not authrize user');
        }
}
module.exports=auth;