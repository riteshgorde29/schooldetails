const express= require ('express');
const bodyParser = require('body-parser');
const mongoose=require("mongoose");
const Product = require('./models/productModel');
const LoginSignUp =require("./models/loginModel");
const cors = require('cors');
const app  = express();
const bcrypt= require ('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
// middleware axis json datatype
app .use (express.json());
app.set('view engine', 'ejs');
app .use (cors());
app.use(bodyParser.json());

app.use(express.urlencoded({extended:false}))// by usings this middleware we can set  data key:valvue from

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

//get data from database
app.get ('/student-info',async(req,res)=>{
    try {
        const studentInfo =await Product.find({})
        res.status(200).json(studentInfo);
    } catch (error) {
        res.status(500).json({message:error.message})      
    }});
//send data to mongo db
app.post('/student-info',async(req, res)=> {
   try {
    const studentInfo = await Product.create (req.body)
    res.status(200).json(studentInfo)

   } catch (error) {
    console.log(error.message);
    res.status(500).json({message:error.message})
    
   }
})
// get data by using id
app.get('/student-info/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const studentInfo = await Product.findById(id);
        res.status(200).json(studentInfo) ;// sucess code
    } catch (error) {
        res.status(500).json({message:error.message}) //sever side message 
    }
})
//update a data
app.put('/student-info/:id',async(req,res)=>{
    try {
        const  {id} =req.params;
        const studentInfo = await Product.findByIdAndUpdate(id,req.body);
        // product can not  find in database
        if(!studentInfo){
            return res.status(404).json({message:`cannot find any product with ID`})
         }
         const  updatedStudentInfo = await Product.findById(id);
         res.status(200).json(updatedStudentInfo);
    } catch (error) {
       res.status(500).json({message:error.message}) 
    }
})
//delete a  product
app.delete('/student-info/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const studentInfo =await Product.findByIdAndDelete(id,req.body)
        if(!studentInfo){
            return res.status(404).json({message:`cannot find any product with ID`})
         }
         res.status(200).json(studentInfo)  
    } catch (error) {
        res.status(500).json({message:error.message})   
    }});
    app.get("/paginationStudent", async (req,res)=>{
      const allStudent = await Product.find({});
      const page = parseInt(req.query.page || "1")
      const limit =parseInt (req.query.limit || "5")
      const startIndex = (page -1 )* limit
      const lastIndex =(page)* limit
      const results = {}
      results.totalProduct= allStudent.length;
      results.pageCount=Math.ceil(allStudent.length/limit);
     
      if (lastIndex < allStudent.length) {
        results.next={
          page:page+1,
               }
      }
      if (startIndex >0) {
        results.pre ={
          page:page-1,
        } 
      }
      results.result= allStudent.slice(startIndex,lastIndex);
      res.json(results)
    })
// Route to get all products in ascending order
app.get('/ascending', async (req, res) => {
    try {
      const studentInfo= await Product.find({}).sort({ firstName: 1, age:1 });
      res.status(200).json(studentInfo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route to get all products in descending order
app.get('/descending', async (req, res) => {
    try {
      const studentInfo= await Product.find({}).sort({ firstName: -1,contactNumber: -1});
      res.status(200).json(studentInfo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route to get all products with sorting options
  app.get('/asc/des', async (req, res) => {
    try {
      const { sort } = req.query;
  
      if (sort === 'ascending') {
        sortOptions = { firstName: 1 }; 
      } else if (sort === 'descending') {
        sortOptions = { firstName: -1 }; 
      } else {
        sortOptions = {}; // No sorting, default order
      }
  
      const studentInfo = await Product.find({}).sort();
      res.status(200).json(studentInfo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
 
//  sreach all Students by rollNumber,firstName and lastName
app.get("/searchStudent", async (req, res) => {
    try {
      const { rollno, firstName, lastName } = req.query;
  
      let query = {};
  
      if (rollno) {
        query.rollno = rollno;
      }
  
      if (firstName) {
        query.firstName = { $regex: firstName, $options: "i" };
      }
  
      if (lastName) {
        query.lastName = { $regex: lastName, $options: "i" };
      }
  
      const studentInfo = await Product.find(query);
      res.status(200).json(studentInfo); // success code
    } catch (error) {
      res.status(500).json({ message: error.message }); // server-side message
    }
  });  
  
  // Search students based on the provided search parameters
app.get('/find/info', async (req, res) => {
    const { firstName, lastName, age, rollno } = req.query;
    const searchParams = {};
  
    if (firstName) {
      searchParams.firstName = new RegExp(firstName, 'i');
    }
  
    if (lastName) {
      searchParams.lastName = new RegExp(lastName, 'i');
    }
  
    if (age) {
      searchParams.age = parseInt(age);
    }
  
    if (rollno) {
      searchParams.rollno = parseInt(rollno);
    }
  
    try {
      const studentInfo = await Product.find(searchParams);
      res.status(200).json(studentInfo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Route to search products by roll number
app.get('/rollsearch', async (req, res) => {
    try {
      const {rollno} = req.query;
  
      const searchResult = await Product.findOne({ rollno });
  
      if (!searchResult) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(searchResult);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app.post("/register", async (req, res) => {
    const { fname, lname, email, password, userType } = req.body;
  
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
      const oldUser = await LoginSignUp.findOne({ email });
  
      if (oldUser) {
        return res.json({ error: "User Exists" });
      }
      await LoginSignUp.create({
        fname,
        lname,
        email,
        password: encryptedPassword,
        userType,
      });
      res.send({ status: "ok" });
    } catch (error) {
      res.send({ status: "error" });
    }
  });
  
  app.post("/loginUser", async (req, res) => {
    const { email, password } = req.body;
    const user = await LoginSignUp.findOne({ email });
    if (!user) {
      return res.json({ error: "User Not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "10m",
      });
      if (res.status(201)) {
        return res.json({ status: "ok", data: token });
      } else {
        return res.json({ error: "error" });
      }
    }
    res.json({ status: "error", error: "InvAlid Password" });
  });
  
  
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await LoginSignUp.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "10m",
    });
    const link = `http://localhost:3001/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "riteshgorde29@gmail.com",
        pass: "mpzkajcipnkmvocb",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "riteshgorde29@gmail.com",
      subject: "sending Email using node js server",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) { }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await LoginSignUp.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await LoginSignUp.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await LoginSignUp.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});
// connected to data base
mongoose.set ("strictQuery",false)
 mongoose.connect('mongodb+srv://r29:g29@cluster0.xxbrdmu.mongodb.net/Node-API?retryWrites=true&w=majority')
  
.then(()=>{
    console.log('connected to mongoDB')
//localhost port number
app.listen(3001,()=>{
    console.log("node api  is runing on 3001 port ") //message show in terminal
    })

}).catch((error)=>{
    console.log(error)
});
   