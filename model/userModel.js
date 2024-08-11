let moongose=require('mongoose');
let validator=require('validator')
let userSchema=new moongose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validata(value){
            if(!validator.isEmail(value)){
                throw new Error('email not valid');
            }
        }
    },
     password:{
        type:String
    }, 
    cpassword:{
        type:String
    }, 
    role:{
        type:String
    },
      
teacher:{
mobileNo:{
    type:Number
},
quilification:{
    type:String

},
experience:{
    type:String

}
    },
student:{
        Class:{
            type:String
        },    
    roll:{
        type:String
    },
    phone:{
        type:String

    }
}
})

let userModel=new moongose.model('userModel',userSchema);

module.exports=userModel
