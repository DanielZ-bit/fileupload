const User = require("../models/authmodel")


const register = async(req, res)=>{
    const {name, email, password} = req.body;
    const user  = await User.create({name: name, email: email, password: password});
    const token = user.createJWT();
    res.status(200).json({user: {user:user.name}, token});

}

const login = async (req,res) =>{
    const {email, password} = req.body;
    if (!email || ! password){
        throw new Error("no user or password");
    }
    const user = await User.findOne({email});
    if (!user){
        throw new Error("unauthenticated");
    }
    
    const passwordTest = await user.comparePasswords(password);
    if (!passwordTest) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = user.createJWT();
    res.status(200).json({user: {user: user.name},token})

}

module.exports = {register, login};