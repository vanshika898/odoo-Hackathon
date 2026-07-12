const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
require("dotenv").config();


//auth
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "") || req.body.token;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Token is missing"
        })
    }

    //verify token
     try{
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verifyToken", verifyToken);
    req.user = verifyToken;
    next();
     }catch(error){
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
     } 

  }catch(error){
    return res.status(401).json({
      success:false,
      message:"Something went wrong while verifying the token",
    })
  }
  }


  // isStudent
  // exports.isStudent = async(req,res,next)=>{
  //   try{
  //       const {accountType} = req.user;
  //       if(accountType !== "Student"){
  //           return res.status(401).json({
  //               success:false,
  //               message:"This is a protected route for students only"
  //           })
  //       }
  //       next();

  //   }catch(error){
  //       return res.status(401).json({
  //           success:false,
  //           message:"User is not authorized to access this route",
  //       })
  //   }
  // }


  // isInstructor

//   exports.isInstructor = async(req,res,next)=>{
//     try{
//         const {accountType} = req.user;
//         if(accountType !== "Instructor"){
//             return res.status(401).json({
//                 success:false,
//                 message:"This is a protected route for instructors only"
//             })
//         }
//         next();

//     }catch(error){
//         return res.status(401).json({
//             success:false,
//             message:"User is not authorized to access this route",
//         })
//     }
//   }

// exports.isAdmin = async(req,res,next)=>{
// try{
// const {accountType} = req.user;
// if(accountType !== "Admin"){
//     return res.status(401).json({
//         success:false,
//         message:"This is a protected route for Admins only"
//     })
// }
// }catch(error){
// return res.status(401).json({
//     success:false,
//     message:"User is not authorized to access this route",
// })
// }}

