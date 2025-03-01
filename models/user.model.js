const mongoose = require("mongoose");

const bcrypt = require("bcryptjs")

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



userSchema.post("findOneAndDelete", async function (doc) {
    if (doc && doc.kyc) { // Check if doc and doc.kyc exist
        try {
            const kycModel = mongoose.model("Kyc");
            await kycModel.findByIdAndDelete(doc.kyc);
            console.log(`KYC for user ${doc.name} has been deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting KYC for user ${doc.name}:`, error);
        }
    } else {
        console.log("No KYC associated with this user or user not found.");
    }
});
    
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;