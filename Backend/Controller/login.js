const User = require('../Model/login');
const EncryptPassword = require("../helper/hashPassword");
const bcrypt = require('bcrypt');
const { signToken } = require('../helper/jwt');

const register = async (req, res) => {

    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: await EncryptPassword(req.body.password)
        });

        await user.save();
        res.status(201).json({ message: "User created successfully" })
    }
    catch (error) {
        if(error.code === 11000){
           return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: error.message });
    }
}

const allUsers = async (req, res) => {

    try {
        const user = await User.find();
        if(!user){
            return res.status(404).json({message : "No users found"})
         }
        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOneUser = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message : "User not found"})
         }
        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log(user)
            const comparedPassword = await bcrypt.compare(password, user.password);
            if (comparedPassword) {
                const token = signToken(user);
                res.status(200).json({ status: "success", token: token, id : user._id, username : user.username });
            }
            else {
                return res.status(403).json({ message: "Incorrect password" })
            }
        }
        else {
            return res.status(404).json({ message: "No user found" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { register, allUsers, getOneUser, login }