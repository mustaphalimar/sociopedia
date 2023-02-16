import Post from "../models/Post.js";
import User from "../models/User.js";

export async function createPost(req, res) {
  const { userId, description, picturePath } = req.params;

  try {
    // Getting the user who's creating the post
    const user = await User.findById(userId);

    // Creating a new post using the userId
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      userPicturePath: user.picturePath,
      description,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();
    const posts = await Post.find();

    res.status(201).json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: error.message });
  }
}

export async function getFeedPosts(req, res) {
  try {
    const posts = await Post.find();
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
}

export async function getUserPosts(req, res) {
  const { userId } = req.params;
  try {
    const posts = await Post.find(userId);
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
}

export async function likePost(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    // Getting the post data
    const post = await Post.findById(id);
    // checking if the user had already liked the post
    const isLiked = post.likes.get(userId);

    // if so, remove the like, otherwise just add it
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    // Just updarting the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
}
