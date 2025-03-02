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
    if (doc) { // Check if doc exist
        try {
            if (doc.kyc) {
                const kycModel = mongoose.model("Kyc");
                await kycModel.findByIdAndDelete(doc.kyc);
                console.log(`KYC for user ${doc.name} has been deleted successfully.`);
            }

            await Post.deleteMany({ userId: doc._id });
            console.log(`All posts for user ${doc._id} have been deleted.`);
        }   catch (error) {
            console.log(`Error deleting associated documents for user ${doc._id}`);
        }
    } else {
        console.log("User not found or already deleted");
    }
});
    
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
