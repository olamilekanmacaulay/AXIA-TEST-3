const mongoose = require("mongoose");

const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: { 
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        post: [{
            type: mongoose.Types.ObjectId,
            ref: "Post"
        }],

        kyc: {
            type: mongoose.Types.ObjectId,
            ref: "Kyc",
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashedPassword;
    next();
});

userSchema.post("findOneAndDelete", async function (doc, next) {
    const kycModel = mongoose.model("kyc");
    await kycModel.findByIdAndDelete(doc.kyc);
    console.log("Kyc has been deleted successfully")
});
    
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;