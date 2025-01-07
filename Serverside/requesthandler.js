// import userSchema from "./model/user.js"
// import userDataSchema from "./model/userData.js"
// import postSchema from "./model/post.js"
import nodemailer from "nodemailer"

import bcrypt from "bcrypt"
import pkg from "jsonwebtoken"
const { sign } = pkg

const transporter = nodemailer.createTransport({
    service:"gmail",
    // host: "sandbox.smtp.mailtrap.io",
    // port:2525 ,
    // secure: false,
    auth: {
    //   user: "usmnchusman606@gmail.com",
    //   pass: "kobm upne reiz mryv",
    user:"muhammadnashid905@gmail.com",
    pass:"zudt nnnf bhlc qpoh"
  }
})

export async function addUser(req, res) {
  const { username, email, pwd, cpwd } = req.body
  const user = await userSchema.findOne({ email })
  if (!user) {
    if (!(username && email && pwd && cpwd))
      return res.status(500).send({ msg: "fields are empty" })
    if (pwd != cpwd) return res.status(500).send({ msg: "pass not match" })
    bcrypt
      .hash(pwd, 10)
      .then((hpwd) => {
        userSchema.create({ username, email, pass: hpwd })
        res.status(201).send({ msg: "Successfull" })
      })
      .catch((error) => {
        console.log(error)
      });
  } else {
    res.status(500).send({ msg: "email already used " })
  }
}

export async function login(req, res) {
  const { email, pass } = req.body
  if (!(email && pass))
    return res.status(500).send({ msg: "fields are empty" })
  const user = await userSchema.findOne({ email })
  if (!user) return res.status(500).send({ msg: "email donot exist" })
  const success = await bcrypt.compare(pass, user.pass)
  if (success !== true)
    return res.status(500).send({ msg: "email or password not exist" })
  const token = await sign({ UserID: user._id }, process.env.JWT_KEY, {expiresIn: "24h",})
  res.status(201).send({ token })
}

export async function verifyEmail(req, res) {
    const {email}=req.body
    // console.log(email);
    if (!(email))  {
        return res.status(500).send({msg:"fields are empty"})
    }
    const user= await userSchema.findOne({email})        
    if (!(user)){
        const info = await transporter.sendMail({
            from: 'muhammadnashid905@gmail.com', // sender address
            to: email, // list of receivers
            subject: "email", // Subject line
            text: "VERIFY! your email", // plain text body
            html: `
            <div style="height: 200px; width: 200px; margin-left: 500px; margin-top: 250px;" >
        <div style="width: 400px; height: 150px; border:none; background-color: rgb(248, 247, 247); border-radius: 3px; box-shadow:0 0 2px 2px rgb(199, 197, 197); ">
            <h3 style="color: rgb(146, 57, 16); font-weight: bold; font-size: 25px; margin-top: 10px; margin-left: 110px;">Email Validation</h3>
            <input type="text" name="email" id="email" placeholder="enter email" style="width: 250px; height: 30px; margin-top: 40px; margin-left: 20px;">
             <a href="http://localhost:5173/register">
            <button style="height:40px; width: 90px; color: white; background-color: seagreen; border: none; border-radius: 4px; font-weight: bold;">Verify</button>
            </a>
        </div>
    </div>
    `,
    })
    console.log("Message sent: %s", info.messageId)
    res.status(200).send({ msg: "Verificaton email sented" })
  } else {
    return res.status(500).send({ msg: "email exist" })
  }
}

export async function getUser(req, res) {
  const usr = await userSchema.findOne({ _id: req.user.UserID })
  res.status(200).send({ name: usr.username })
}

export async function getUserData(req, res) {
  const usr = await userSchema.findOne({ _id: req.user.UserID })
  const data = await userDataSchema.findOne({ userId: req.user.UserID })
  if (!data) res.status(200).send({ usr })
  else {
    res.status(200).send({ usr, data })
  }
}

export async function addUserData(req, res) {
    try {
      const { nickname, dob, note } = req.body
    await userDataSchema.create({userId:req.user.UserID,nickname,dob,note})
      res.status(200).send({ msg: "Data added successfully!" })
    } catch (error) {
      console.error(error)
      res.status(500).send({ msg: "Failed to add data. Please try again." })
    }
}
  
export async function editUserData(req, res) {
    try {
      const { nickname, dob, note } = req.body
      const updatedData = await userDataSchema.updateOne({ userId: req.user.UserID },{ $set: { nickname, dob, note } },)
      res.status(200).send({ msg: "Data updated successfully!", data: updatedData })
    } catch (error) {
      console.error(error)
      res.status(500).send({ msg: "Failed to update data. Please try again." })
    }
}  

export async function deleteUser(req, res) {
  try {
    await userDataSchema.deleteOne({userId:req.user.UserID})
    await userSchema.deleteOne({ _id: req.user.UserID })
    res.status(200).send({ msg: "Data deleted successfully!"})
  } catch (error) {
    console.error(error)
    res.status(500).send({ msg: "Failed to delete data. Please try again." })
  }
} 

export async function addPost(req, res) {
  try {
    // console.log(req.user.UserID)
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString(); 

    const {caption,description,images}=req.body
    const post = await postSchema.create({userId: req.user.UserID,caption,description,images,date,time});
    res.status(200).send({ msg: "Post added successfully!", data: post })
  } catch (error) {
    console.error(error)
    res.status(500).send({ msg: "Failed to add data. Please try again." })
  }
}

export async function getPosts(req, res) {
  try {
    const posts = await postSchema.find({ userId: req.user.UserID });
    if (!posts || posts.length === 0) {
      return res.status(200).send({ msg: "No posts found", data: [] });
    }
    res.status(200).send({ data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to fetch posts. Please try again." });
  }
}

export async function getAllPosts(req, res) {
  try {
    const posts = await postSchema.find();
    // if (!posts || posts.length === 0) {
    //   return res.status(200).send({ msg: "No posts found", data: [] });
    // }
    res.status(200).send({ data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to fetch posts. Please try again." });
  }
}

export async function getPost(req, res) {
  try {
    const post = await postSchema.findOne({_id: req.params.id});
    // if (!post) {
    //   return res.status(404).send({ msg: "Post not found" });
    // }
    res.status(200).send({ post });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to fetch post. Try again later." });
  }
}

export async function deletePost(req, res) {
  try {
    const post = await postSchema.deleteOne({_id: req.params.id});
    res.status(200).send({ msg: "Post deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to delete post. Try again later." });
  }
}