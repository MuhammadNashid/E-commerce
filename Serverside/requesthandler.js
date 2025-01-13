import userSchema from "./model/user.js"

import addressSchema from "./model/address.js"
import sellerSchema from "./model/seller.js"
import productSchema from "./model/product.js"
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt'
import pkg from "jsonwebtoken"
const { sign } = pkg



export async function addUser(req, res) {
    const { username, email, phone, accType, pwd, cpwd} = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      if (!(username && email && pwd && cpwd))
        return res.status(500).send({ msg: "fields are empty" });
      if (pwd !== cpwd) return res.status(500).send({ msg: "pass not match" });
      bcrypt
        .hash(pwd, 10)
        .then((hpwd) => {
          userSchema.create({ username, email, phone, accType, pass: hpwd});
          res.status(201).send({ msg: "Successfull" });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ msg: "Error creating user." });
        });
    } else {
      res.status(500).send({ msg: "email already used" });
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
  const { email } = req.body
  
  if (!email) {
    return res.status(500).send({ msg: "fields are empty" })
  }
  const user = await userSchema.findOne({ email })
  if (!user) {
    return res.status(500).send({ msg: "email not exist" })
  } else {
    const info = await transporter.sendMail({
      from: "muhammadnashid905@gmail.com",
      to: email,
      subject: "verify",
      text: "VERIFY! your email",
      html: `
    <div class=" page" style="width: 500px; height: 300px; display: flex; 
    align-items: center; justify-content: center; flex-direction: column;
     background-color: gainsboro;box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; ">
        <h2>Email verification</h2>
        <p>Click This Button to verify its you</p>
        <a href="http://localhost:5173/resetPassword"><button style="padding: 5px 15px; border: none; border-radius: 4px; 
        background-color: white;box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        font-size: 18px; color: red; font-style: italic;" >Verify</button></a>
    </div>`,
    })
    console.log("Message sent: %s", info.messageId)
    res.status(200).send({ msg: "Verificaton email sented" })
  }
}

export async function updatePassword(req,res){
  const {pass,cpass,email}=req.body
  console.log(req.body);
  if(pass!=cpass)
      return res.status(500).send({msg:"password missmatch"})
  bcrypt.hash(pass,10).then((hpwd)=>{
      userSchema.updateOne({ email }, { $set: { pass: hpwd } }).then(()=>{
          res.status(201).send({msg:"Password changed successfully"})
      }).catch((error)=>{
          res.status(404).send({error:error})
      })  
  }).catch((error)=>{
      console.log(error)
  })
}
// export async function getUser(req, res) {
//   const usr = await userSchema.findOne({ _id: req.user.UserID })
//   res.status(200).send({ name: usr.username})
// }


export async function getUserData(req, res) {
    const usr = await userSchema.findOne({ _id: req.user.UserID })
    // console.log(usr);
    res.status(200).send({ usr })
}


export async function updateUserData(req, res) {
  console.log(req.body);
  console.log(req.user.UserID);
  
  
  try {
    const {username,email,phone,accType} = req.body
    const updatedData = await userSchema.updateOne({_id:req.user.UserID },{ $set:{username,email,phone,accType}},)
    res.status(200).send({ msg: "Data updated successfully!", data: updatedData })
  } catch (error) {
    console.error(error)
    res.status(500).send({ msg: "Failed to update data. Please try again." })
  }
}

export async function addAddress(req, res) {
  try {
    const { city, pincode, district, country } = req.body;

    // Validate required fields
    if (!city || !pincode || !district || !country) {
      return res.status(400).send({ msg: "All address fields are required." });
    }
    const newAddress = await addressSchema.create({userID: req.user.UserID,city,pincode,district,country});
    res.status(201).send({
      msg: "Address added successfully!",
      data: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).send({
      msg: "Failed to add address. Please try again later.",
      error: error.message,
    });
  }
}


export async function getUserAddresses(req, res) {
  try {
    // Fetch user ID from the token
    const userId = req.user.UserID;

    // Find all addresses associated with the user
    const addresses = await addressSchema.find({ userID: userId });

    if (!addresses || addresses.length === 0) {
      return res.status(404).send({ msg: "No addresses found for the user." });
    }

    res.status(200).send({
      msg: "Addresses fetched successfully!",
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).send({
      msg: "Failed to fetch addresses. Please try again later.",
      error: error.message,
    });
  }
}


export async function getCompany(req, res) {
  try {
    console.log(req.user.UserID);
    
    const company = await sellerSchema.findOne({ sellerID: req.user.UserID });
    console.log(company);
    
    if (company) {
      res.status(200).send({ company });
    } else {
      res.status(404).send({ msg: "No company details found." });
    }
  } catch (error) {
    res.status(500).send({ msg: "Failed to fetch company details.", error });
  }
}


export async function addCompany(req, res) {
  console.log(req.body);
  try {
    const {companyName,place,pincode,district,state,country}=req.body
    const company = await sellerSchema.create({sellerID:req.user.UserID,companyName,place,pincode,district,state,country });
    return res.status(201).json({ message: "Company added successfully!", company: company });
  } catch (error) {
    console.error("Error adding company:", error);
    return res.status(500).json({ message: "Server error while adding company." });
  }
}





export async function editCompany(req, res) {
  // Validate the request body (optional)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { companyName, place, pincode, district, state, country } = req.body;

  try {
    // Find the company by its ID (you can find it using sellerID or any other unique field)
    const companyId = req.body.sellerID; // Assuming you send the sellerID in the request body to identify the company
    const company = await sellerSchema.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    // Update the company details
    company.companyName = companyName || company.companyName;
    company.place = place || company.place;
    company.pincode = pincode || company.pincode;
    company.district = district || company.district;
    company.state = state || company.state;
    company.country = country || company.country;
    
    // Save the updated company details
    await company.save();

    return res.status(200).json({ message: "Company updated successfully!", company });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({ message: "Server error while updating company." });
  }
}
  


export async function addProduct(req, res) {
    try {
      const {...data}=req.body
      const company = await productSchema.create({sellerID:req.user.UserID,...data });
      return res.status(201).json({ message: "Company added successfully!", company: company });
    } catch (error) {
      console.error("Error adding company:", error);
      return res.status(500).json({ message: "Server error while adding company." });
    }
  }


  export async function getProducts(req, res) {
    try {
      const products = await productSchema.find({ sellerID: req.user.UserID });
      if (!products || products.length === 0) {
        return res.status(404).send({ msg: "No products found for this seller." });
      }
      res.status(200).send({ msg: "Products fetched successfully!", products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send({ msg: "Failed to fetch products. Please try again later.", error: error.message });
    }
  }


  export async function getProductsByCategory(req, res) {
    try {
      const category = req.params.category;
      const products = await productSchema.find({ sellerID: req.user.UserID, category });
  
      if (!products || products.length === 0) {
        return res.status(404).send({ msg: "No products found in this category." });
      }
  
      res.status(200).send({ msg: "Products fetched successfully!", products });
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).send({ msg: "Failed to fetch products. Please try again later.", error: error.message });
    }
  }



  export async function getProductById(req, res) {
    try {
      const product = await productSchema.findById(req.params.productId);
  
      if (!product) {
        return res.status(404).send({ msg: "Product not found." });
      }
  
      res.status(200).send({ msg: "Product fetched successfully!", product });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).send({ msg: "Failed to fetch product. Please try again later.", error: error.message });
    }
  }
  

  export async function getAllOtherProducts(req, res) {
    try {
      const products = await productSchema.find({ sellerID: { $ne: req.user.UserID } });
  
      if (!products || products.length === 0) {
        return res.status(404).send({ msg: "No products found." });
      }
  
      res.status(200).send({ msg: "Products fetched successfully!", products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send({ msg: "Failed to fetch products. Please try again later.", error: error.message });
    }
  }

  //cart page
  