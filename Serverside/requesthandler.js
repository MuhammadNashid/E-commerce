import userSchema from "./model/user.js"
import cartSchema from "./model/cart.js"
import sellerOrderSchema from "./model/sellero.js"
import wishListSchema from "./model/wishlist.js";
import buyerOrderSchema from './model/buyer.js'
import addressSchema from "./model/address.js"
import sellerSchema from "./model/seller.js"
import productSchema from "./model/product.js"
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt'
import pkg from "jsonwebtoken"
const { sign } = pkg

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
  user:"muhammadnashid905@gmail.com",
  pass:"zudt nnnf bhlc qpoh"
}
})


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
  const { email, pass } = req.body;

  // Check if fields are empty
  if (!(email && pass)) {
    return res.status(500).send({ msg: "Fields are empty" });
  }

  // Find user by email
  const user = await userSchema.findOne({ email });
  if (!user) {
    return res.status(500).send({ msg: "Email does not exist" });
  }

  // Compare password
  const success = await bcrypt.compare(pass, user.pass);
  if (success !== true) {
    return res.status(500).send({ msg: "Email or password is incorrect" });
  }

  // Generate JWT token
  const token = await sign(
    { UserID: user._id },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  );

  // Send response with token and acctype
  res.status(201).send({
    token, // Authentication token
    accType: user.accType // User account type (e.g., 'buyer' or 'seller')
  });
}
export async function verifyEmail(req, res) {
  const {email}=req.body
  // console.log(email);
  if (!(email))  {
      return res.status(404).send({msg:"fields are empty"})
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
  return res.status(404).send({ msg: "email exist" })
}
}

export async function updatePassword(req, res) {
  const { pass, cpass, email } = req.body;
  if (pass != cpass) return res.status(500).send({ msg: "password missmatch" });
  bcrypt
    .hash(pass, 10)
    .then((hpwd) => {
      userSchema
        .updateOne({ email }, { $set: { pass: hpwd } })
        .then(() => {
          res.status(201).send({ msg: "Password changed successfully" });
        })
        .catch((error) => {
          res.status(404).send({ error: error });
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getUserData(req, res) {
  const usr = await userSchema.findOne({ _id: req.user.UserID });
  res.status(200).send({ usr });
}

export async function updateUserData(req, res) {
  try {
    const { username, email, phone, accType } = req.body;
    const updatedData = await userSchema.updateOne(
      { _id: req.user.UserID },
      { $set: { username, email, phone, accType } }
    );
    res
      .status(200)
      .send({ msg: "Data updated successfully!", data: updatedData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to update data. Please try again." });
  }
}

export async function addAddress(req, res) {
  try {
    const { city, pincode, district, country } = req.body;
    if (!city || !pincode || !district || !country) {
      return res.status(400).send({ msg: "All address fields are required." });
    }
    const newAddress = await addressSchema.create({
      userID: req.user.UserID,
      city,
      pincode,
      district,
      country,
    });
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
    const userId = req.user.UserID;
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
    const company = await sellerSchema.findOne({ sellerID: req.user.UserID });
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
  try {
    const { companyName, place, pincode, district, state, country } = req.body;
    const company = await sellerSchema.create({
      sellerID: req.user.UserID,
      companyName,
      place,
      pincode,
      district,
      state,
      country,
    });
    return res
      .status(201)
      .json({ message: "Company added successfully!", company: company });
  } catch (error) {
    console.error("Error adding company:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding company." });
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

    return res
      .status(200)
      .json({ message: "Company updated successfully!", company });
  } catch (error) {
    console.error("Error updating company:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating company." });
  }
}

export async function addProduct(req, res) {
  try {
    const { ...data } = req.body;
    const company = await productSchema.create({
      sellerID: req.user.UserID,
      ...data,
    });
    return res
      .status(201)
      .json({ message: "Company added successfully!", company: company });
  } catch (error) {
    console.error("Error adding company:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding company." });
  }
}

export async function getProducts(req, res) {
  try {
    const products = await productSchema.find({ sellerID: req.user.UserID });
    if (!products || products.length === 0) {
      return res
        .status(404)
        .send({ msg: "No products found for this seller." });
    }
    res.status(200).send({ msg: "Products fetched successfully!", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .send({
        msg: "Failed to fetch products. Please try again later.",
        error: error.message,
      });
  }
}

export async function getProductsByCategory(req, res) {
  try {
    const category = req.params.category;
    const products = await productSchema.find({sellerID: req.user.UserID,category,});
    if (!products || products.length === 0) {
      return res.status(404).send({ msg: "No products found in this category." });
    }
    res.status(200).send({ msg: "Products fetched successfully!", products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res
      .status(500)
      .send({
        msg: "Failed to fetch products. Please try again later.",
        error: error.message,
      });
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
    res
      .status(500)
      .send({
        msg: "Failed to fetch product. Please try again later.",
        error: error.message,
      });
  }
}

export async function getAllOtherProducts(req, res) {
  try {
    const products = await productSchema.find({
      sellerID: { $ne: req.user.UserID },
    });

    if (!products || products.length === 0) {
      return res.status(404).send({ msg: "No products found." });
    }

    res.status(200).send({ msg: "Products fetched successfully!", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .send({
        msg: "Failed to fetch products. Please try again later.",
        error: error.message,
      });
  }
}


export async function getAllProducts(req, res) {
  try {
    const products = await productSchema.find({});

    if (!products || products.length === 0) {
      return res.status(404).send({ msg: "No products found." });
    }

    res.status(200).send({ msg: "Products fetched successfully!", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .send({
        msg: "Failed to fetch products. Please try again later.",
        error: error.message,
      });
  }
}


export async function addCart(req, res) {
  try {
    const { productID } = req.body;
    const cart = await cartSchema.create({
      productID,
      buyerID: req.user.UserID,
      quantity: "1",
    });
    return res
      .status(201)
      .json({ message: "Added to Cart successfully!", cart });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .send({
        msg: "Failed to fetch products. Please try again later.",
        error: error.message,
      });
  }
}

export async function findOnCart(req, res) {
  try {
    const cart = await cartSchema.findOne({
      productID: req.params.productId,
      buyerID: req.user.UserID,
    });
    return res.status(201).json({ cart });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .send({
        msg: "Failed to fetch products. Please try again later.",
        error: error.message,
      });
  }
}


export async function getCart(req, res) {
  try {
    const cartItems = await cartSchema.find({ buyerID: req.user.UserID });
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "No items found in the cart." });
    }

    const cartDetails = await Promise.all(
      cartItems.map(async (item) => {
        const product = await productSchema.findById(item.productID);
        if (product) {
          return {
            productID: product._id,
            sellerID: product.sellerID,
            name: product.name,
            price: product.price,
            description: product.description,
            thumbnail: product.thumbnail,
            quantity: item.quantity,
          };
        }
        return null;
      })
    );
    // const filteredCartDetails = cartDetails.filter((item) => item !== null);

    return res.status(200).json({ cartItems: cartDetails });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res
      .status(500)
      .send({
        msg: "Failed to fetch cart items. Please try again later.",
        error: error.message,
      });
  }
}



export async function delCartItem(req, res) {
  try {
    const cartItem = await cartSchema.findOneAndDelete({buyerID: req.user.UserID, productID: req.params.productId});
      if (!cartItem) {
        return res.status(404).json({ message: "Item not found in the cart." });
        }
        return res.status(200).json({ message: "Item deleted from cart." });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .send({
        msg: "Failed to fetch products. Please try again later.",
        error: error.message,
      });
  }
}

export async function placeOrder(req, res) {
  try {
    const { cartItems, address } = req.body;

    // Ensure cartItems is an array
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Process all cart items asynchronously
    await Promise.all(cartItems.map(async (item) => {
      try {
        // Ensure that quantity is a number
        const quantity = Number(item.quantity);

        // Validate quantity
        if (isNaN(quantity) || quantity <= 0) {
          console.error(`Invalid quantity for product ${item.productID}: ${item.quantity}`);
          return;
        }

        // Fetch seller and buyer details
        const emailData = await userSchema.findOne({ _id: item.sellerID });
        const buyerData = await userSchema.findOne({ _id: req.user.UserID });

        if (!emailData || !buyerData) {
          console.error("User data not found for seller or buyer.");
          return;
        }

        // Check if the product exists before updating stock
        const product = await productSchema.findOne({ _id: item.productID });
        if (!product) {
          console.error(`Product not found: ${item.productID}`);
          return;
        }

        // Ensure product quantity is enough before decrementing
        if (product.quantity < quantity) {
          console.error(`Insufficient stock for product ${item.productID}`);
          return;
        }

        // Create order records
        await sellerOrderSchema.create({
          sellerID: item.sellerID,
          buyerID: req.user.UserID,
          productID: item.productID,
          quantity: quantity,
          address: address,
          confirm: false
        });

        await buyerOrderSchema.create({
          buyerID: req.user.UserID,
          productID: item.productID,
          quantity: quantity,
          confirm: false
        });

        // Update product stock (decrement quantity)
        const updateResult = await productSchema.updateOne(
          { _id: item.productID },
          { $inc: { quantity: -quantity } } // Ensure quantity is a number
        );

        if (updateResult.modifiedCount === 0) {
          console.error(`Failed to update product quantity for productID: ${item.productID}`);
        }

        // Send email notification
        await transporter.sendMail({
          from: "bujikart@gmail.com",
          to: emailData.email,
          subject: "New Order Received",
          html: `
            <div style="width: 500px; padding: 20px; background-color: gainsboro; 
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; text-align: center;">
              <h2>New Order Notification</h2>
              <p style="font-size: 16px;">You have received a new order. Please review the order details below.</p>
              
              <h3>Buyer Details:</h3>
              <p><strong>Name:</strong> ${buyerData.username}</p>
              <p><strong>Email:</strong> ${buyerData.email}</p>
              <p><strong>Address:</strong> ${address}</p>
        
              <p>If you have any questions, feel free to contact us.</p>
            </div>`,
        });

        console.log(`Email sent to: ${emailData.email}`);
      } catch (err) {
        console.error("Error processing order item:", err);
      }
    }));

    // Delete cart items after processing all orders
    await cartSchema.deleteMany({ buyerID: req.user.UserID });

    return res.status(200).json({ message: "Order Received" });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      message: "Failed to place order. Please try again later.",
      error: error.message,
    });
  }
}

export async function incrementCartQuantity(req, res) {
  try {
    const cartItem = await cartSchema.updateOne(
      { buyerID: req.user.UserID, productID: req.params.productId },
      { $inc: { quantity: 1 } }
    );

    if (cartItem.modifiedCount === 0) {
      return res.status(404).json({ message: "Item not found in the cart." });
    }

    return res.status(200).json({ message: "Quantity Increased" });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return res.status(500).json({
      msg: "Failed to update cart quantity. Please try again later.",
      error: error.message,
    });
  }
}

export async function decrementCartQuantity(req, res) {
  try {
    const cartItem = await cartSchema.updateOne(
      { buyerID: req.user.UserID, productID: req.params.productId, quantity: { $gt: 1 } },
      { $inc: { quantity: -1 } }
    );

    if (cartItem.modifiedCount === 0) {
      return res.status(404).json({ message: "Item not found in the cart or quantity already at minimum." });
    }

    return res.status(200).json({ message: "Quantity decreased" });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return res.status(500).json({
      msg: "Failed to update cart quantity. Please try again later.",
      error: error.message,
    });
  }
}


export async function getBuyerOrder(req, res) {
  try {
    const order = await buyerOrderSchema.find({ buyerID: req.user.UserID });
    
    const detailedOrders = await Promise.all(
      order.map(async (item) => {
        const product = await productSchema.findOne({_id:item.productID});
        return {
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          confirm: item.confirm,
          thumbnail:product.thumbnail,
        };
      })
    );
    res.status(200).json(detailedOrders);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({msg: "Failed to fetch products. Please try again later.",error: error.message,});
  }
}


export async function getSellerOrders(req, res) {
  try {
    const order = await sellerOrderSchema.find({ sellerID: req.user.UserID });
    
    const detailedOrders = await Promise.all(
      order.map(async (item) => {
        const product = await productSchema.findOne({_id:item.productID});
        const buyer=await userSchema.findOne({_id:item.buyerID})
        
        return {
          buyername: buyer.username,
          address:item.address,
          productname: product.name,
          productID:item.productID,
          quantity: item.quantity,
          confirm: item.confirm,
        };
      })
    );
    res.status(200).json(detailedOrders);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({msg: "Failed to fetch products. Please try again later.",error: error.message,});
  }
}



export async function confirmOrder(req, res) {
  try {
    const found = await sellerOrderSchema.findOne({sellerID: req.user.UserID,productID: req.params.productId});
    if (!found) {
      return res.status(404).json({ msg: "Order not found" });
    }

    await buyerOrderSchema.updateOne({ buyerID: found.buyerID, productID: req.params.productId },{ $set: { confirm: true } });
    await sellerOrderSchema.updateOne({ sellerID: req.user.UserID, productID: req.params.productId },{ $set: { confirm: true } });

    const product=await productSchema.findOne({_id:req.params.productId})
    
    const emailData= await userSchema.findOne({_id:found.buyerID})
    

    const info = await transporter.sendMail({
      from: "bujikart@gmail.com",
      to: emailData.email,
      subject: "Order Confirmed",
      text: "Your order has been confirmed!",
      html: `
        <div class="page" style="width: 500px; height: auto; padding: 20px; 
        display: flex; align-items: center; justify-content: center; flex-direction: column;
        background-color: #f0f8ff; box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
          <h2 style="color: #2c3e50;">Order Confirmation</h2>
          <p style="font-size: 16px; color: #34495e;">Congratulations! Your order has been successfully confirmed. Please review the order details below.</p>
          
          <h3 style="margin: 10px 0; color: #2980b9;">Product Details:</h3>
          <p style="font-size: 14px; color: #34495e;"><strong>Name:</strong> ${product.name}</p>
          <p style="font-size: 14px; color: #34495e;"><strong>Description:</strong> ${product.description}</p>
          <p style="font-size: 14px; color: #34495e;"><strong>Quantity:</strong> ${found.quantity}</p>
          <p style="font-size: 14px; color: #34495e;"><strong>Price:</strong> ₹${product.price * found.quantity}</p>
        
          <h3 style="margin: 20px 0 10px; color: #2980b9;">Order Summary:</h3>
          <p style="font-size: 14px; color: #34495e;"><strong>Order Status:</strong> Confirmed</p>
          <p style="font-size: 14px; color: #34495e;">We are processing your order and will notify you once it's shipped.</p>
          
          <p style="font-size: 14px; color: #34495e;">If you have any questions, feel free to contact us.</p>
        </div>`,
    });
    console.log("Order confirmation message sent to:", emailData.email);

    res.status(200).json({ msg: "Order confirmed successfully" });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).send({
      msg: "Failed to confirm the order. Please try again later.",
      error: error.message,
    });
  }
}


export async function addToWishlist(req, res){
  const productID = req.params.productId;
  const buyerID = req.user.UserID
  try {
    const exists = await wishListSchema.findOne({ buyerID, productID });
    if (exists) {
      return res.status(400).json({ message: "Product is already in wishlist." });
    }

    await wishListSchema.create({buyerID,productID})
    res.status(200).json({ message: "Added to wishlist successfully." });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export async function removeFromWishlist(req, res){
  const productID = req.params.productId;
  const buyerID = req.user.UserID
  try {
    const result = await wishListSchema.findOneAndDelete({ buyerID, productID });
    if (!result) {
      return res.status(404).json({ message: "Product not found in wishlist." });
    }

    res.status(200).json({ message: "Removed from wishlist successfully." });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export async function checkWishlist(req, res){
  const productID = req.params.productId;
  const buyerID = req.user.UserID
  try {
    const exists = await wishListSchema.findOne({ buyerID, productID });
    res.status(200).json({ isFavorite: !!exists });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export async function getWishList(req, res) {
  try {
    const exists = await wishListSchema.find({ buyerID: req.user.UserID });

    const wishList = await Promise.all(exists.map(async (item) => {
      const product = await productSchema.findById(item.productID);
      return {
        productId:item.productID,
        name: product.name, 
        thumbnail: product.thumbnail, 
        price: product.price,
      };
    }));
    res.status(200).json(wishList);
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}