import express from "express"; 

const router = express.Router();

router.get("/signup", (req,res) => {
    res.json({ message: "endpoint for signup!!!" });
})
router.get("/login", (req,res) => {
    res.json({ message: "endpoint for login!!!" });
})

router.get("/logout", (req,res) => {
    res.json({ message: "endpoint for logout!!!" });
})


export default router;