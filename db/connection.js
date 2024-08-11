let mongoose=require('mongoose');

// SECRET_KEY='y32y2bcc83vvchcyklacvznutrkjBcggvcvDCCd'
// MONGO_URI='mongodb+srv://ankursasmal2024:Ankur123@cluster0.poymr.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0'

let conection= mongoose.connect('mongodb+srv://ankursasmal2024:Ankur123@cluster0.poymr.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
    console.log('db connect');
}).catch(()=>{
    console.log('db not connect');
})
module.exports=conection;