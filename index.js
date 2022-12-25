const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000

//use middleware
app.use(cors());
 app.use(express.json())

// ----------===========------



const uri = "mongodb+srv://CutSewTech:CmLYStHT4N!XgiU@cluster0.dzdxbuj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const userCollection = client.db("users").collection("user");

// /******verifyAddmin ********/

const verifyAddmin=async(req,res,next)=>{
  const requerster =req.query.email;
  const requersterAccount = await userCollection.findOne({email:requerster});
  if(requersterAccount?.role==="admin"){
    next()
  }else{
    
  }
}

app.get('/admin',verifyAddmin,async(req,res)=>{
  const email=req.query.email;
  const user = await userCollection.findOne({email:email});
  const isAdmin=user.role==='admin';
  res.send({admin:isAdmin})
})
    
    //send all user information by registration
    app.post('/users',async(req,res)=>{
      const user = req.body
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
    //get all user information by registration
    app.get("/user",async(req,res)=>{
      const user = await userCollection.find().toArray();
      res.send(user)
    })

    /******delete user by email********/
    // app.delete('/removeuser/:Id',async(req,res)=>{
    //   const Id = req.params.Id;
    //   const query = {_id:ObjectId(Id)}
    //   const result = await userCollection.deleteOne(query)
    //   res.send(result)

    // })
//Make Admin----------------
 //ADMIN ROLL
app.put('/verifyUsers',verifyAddmin,async(req,res)=>{
  const email = req.body.email;
    const filter = {email:email};
    const updateDoc = {
      $set:{role:"admin"},
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
 
})
//Remove Admin----------------
app.put('/removeAdmin',verifyAddmin,async(req,res)=>{
  const email = req.body.email;
    const filter = {email:email};
    const updateDoc = {
      $set:{role:""},
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
 
})

  }
  finally {
  
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})