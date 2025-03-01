const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

const createPost = async (req, res) => {
  const user = req.user;
  const body = req.body;
  try {
    // create a new post
    const newPost = new postModel({ ...body, creator: user });
    const savedPost = await newPost.save();
    // modify the users account.
    const getUser = await userModel.findById(user);
    const allPostIds = getUser.posts;
    allPostIds.push(savedPost.id);
    await userModel.findByIdAndUpdate(
      user,
      { posts: allPostIds },
      { new: true }
    );
    res.json({ message: "post created successfully" });
  } catch (error) {
    console.log(error);
    res.send("something went wrong");
  }
};

module.exports = {
  createPost
};
