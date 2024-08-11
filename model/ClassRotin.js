let moongose=require('mongoose');
let validator=require('validator')
let rotineSchema=new moongose.Schema({
    teacherName:{
        type:String
    },
    mobileNo:{
        type:String

    },
     
     start:{
        type:String
    }, 
    end:{
        type:String
    }, 
    day:{
        type:String
    },
      
 
})

let rotineModel=new moongose.model('rotineModel',rotineSchema);

module.exports=rotineModel
