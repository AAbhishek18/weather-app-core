const express=require("express")
const router=express.Router()


const user_controller=require("../controllers/user.controllers")


router.post("/add-user",user_controller.create_user)
router.post("/user-login",user_controller.login_user)





module.exports=router