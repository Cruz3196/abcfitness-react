import express from "express"; 

const router = express.Router();

router.get("/signup", (req,res) => {
    res.json({ message: "endpoint for signup" });
})

export default router;