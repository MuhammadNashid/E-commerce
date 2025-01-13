import mongoose from "mongoose"
const productSchema = new mongoose.Schema({
    BuyerID: { type: String },
    name: { type: String },
    price: { type: String },
    quantity: { type: String },
    thumbnail: { type: String },
})

export default mongoose.model.cart||mongoose.model('cart',cartSchema)