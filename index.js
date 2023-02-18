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



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzdxbuj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const userCollection = client.db("users").collection("user");
    const productsCOllection = client.db("products").collection("product");


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
// /******----------verifyUserAddmin------------------ ********/

const verifyUserAddmin=async(req,res,next)=>{
  const requerster =req.query.email;
  const requersterAccount = await userCollection.findOne({email:requerster});
  if(requersterAccount?.role==="serviceAdmin"){
    next()
  }else{
    
  }
}

app.get('/serviceAdmin',verifyUserAddmin,async(req,res)=>{
  const email=req.query.email;
  const user = await userCollection.findOne({email:email});
  const isAdmin=user.role==='serviceAdmin';
  res.send({admin:isAdmin})
})
    
    //send all user information by registration
    app.post('/userss',async(req,res)=>{
      const user = req.body;
      const exist = await userCollection.findOne({email:user.email})
      const exist1 = await userCollection.findOne({Number:user.Number})
     if(!exist || !exist1){
      const result = await userCollection.insertOne(user)
      res.send(result)
     }
  
    })
    //get all user information by registration
    app.get("/user",async(req,res)=>{
      const user = await userCollection.find().toArray();
      res.send(user)
      
    })
//send UsersPhone Info backend
// app.post('/userPhone',async(req,res)=>{
//   const userPhone = req.body;
//     const result = await userCollections.insertOne(userPhone)
//      res.send(result)
//      console.log(result)

// })
    /******delete user by Id********/
    // app.delete('/removeuser/:Id',async(req,res)=>{
    //   const Id = req.params.Id;
    //   const query = {_id:ObjectId(Id)}
    //   const result = await userCollection.deleteOne(query)
    //   res.send(result)

    // })
//Make Admin----------------
 //Main ADMIN ROLL
app.put('/verifyUsers',verifyAddmin,async(req,res)=>{
  const email = req.body.email;
    const filter = {email:email};
    const updateDoc = {
      $set:{role:"admin"},
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
 
})
 //Service ADMIN ROLL
app.put('/verifyService',verifyAddmin,async(req,res)=>{
  const email = req.body.email;
    const filter = {email:email};
    const updateDoc = {
      $set:{role:"serviceAdmin"},
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

// -----------getproduct backend info----------
app.post('/addsProducts',async(req,res)=>{
  const products=req.body;
  const result = await productsCOllection.insertOne(products);
  res.send(result)
  console.log(result)
})

// ----**********get all product***********-----
app.get('/addsProduct',async(req,res)=>{
  const products = await productsCOllection.find().toArray()
  res.send(products)
})
// ----*******get products Details-----*********
app.get('/productDetails/:id',async(req,res)=>{
  const id = req.params.id;
  const query ={_id:ObjectId(id)}
  const getProduct = await productsCOllection.findOne(query)
  res.send(getProduct)
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