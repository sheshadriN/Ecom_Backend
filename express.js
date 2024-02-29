const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require('./schema');
// const user = require('./schema');
mongoose.connect('mongodb://127.0.0.1:27017/backend').then(()=>{
    console.log("database is connected");
}).catch((err)=>{
    console.log(err.message)
})
// const newuser =  new user({
//     name:"learn",
//     email:"learn@gmail.com"
// })
// newuser.save();


app.get('/api',async(req,res)=>{
    const data = req.body;

    const users = await user.find();
    res.json(users);
})


app.put('/update',async(req,res)=>{
    const id = req.body;
    await user.findByIdAndUpdate(id,{name:"shesha"}).then(()=>{
        res.send('data is updated');
    }).catch((err)=>{
        res.send(err.message)
    })

})
app.delete('/delete',async(req,res)=>{
    const id = req.body;
    await user.findByIdAndDelete(id).then(()=>{
        console.log("deleted");
        res.send("deleted")
    }).catch(err=>{
        console.log(err.message);
        res.send(err.message)
    })

})



app.listen(3000,()=>{
    console.log(`server is running http://localhost:3000`);
})