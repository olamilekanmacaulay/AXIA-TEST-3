const userModel = require("../models/users.model");
const kycModel = require("../models/kyc.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

        
const createUser = async (req, res) => {
    const { password, ...others } = req.body;
    const isUser = await userModel.findOne({ email: others.email });
    if (isUser) {
    return res
        .status(400)
        .send("user already exists");
    }
    try {
        const newUser = new userModel({ ...others, password});
        await newUser.save();
        res
            .status(201)
            .send("user created successfully")
    } catch (error) {
        res.send(error);
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(404)
            .json({message: "Check the provided credentials and try again."});
    }

    const checkUser = await userModel.findOne({ email });
    if (!checkUser) {
        return res
            .status(401)
            .json({message: "Seems like you haven't signed up yet, sign up now"})
    }

    const comfirmPassword = bcrypt.compareSync(password, checkUser.password);
    if (!comfirmPassword) {
        return res
            .status(401)
            .json({message: "Wrong password, try again."});
    }

    // creating a jwt token

    const token = jwt.sign({id: checkUser.id}, process.env.JWT_PASSWORD);
    return res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json(checkUser);
};


const createKyc = async (req, res) => {
    const body = req.body;
    const user = req.user;
    try {
      // first create the kyc
      const kyc = new kycModel({ ...body, user });
      const savedKyc = await kyc.save();
      // second update the user model kyc field
      await userModel.findByIdAndUpdate(
        user,
        { kyc: savedKyc.id },
        { new: true }
      );
      res.send("kyc created successfully");
    } catch (error) {
      res.send("something went wrong");
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.body;
    try{
        await userModel.findByIdAndDelete(id);
        res.status(200).send("user deleted successfully");
    } catch (error) {
        res.status(500).send("something went wrong")
    }
};