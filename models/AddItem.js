import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    category: { type: String, required: true },
    colour: { type: String }, 
    price: { type: Number, required: true },
    availableQty: { type: Number, required: true },
    userName: { type: String, required: true }, //This is add to the schema to identify the user name who added the product
    userEmail: { type: String, required: true }, //This is add to the schema to identify the user email who added the product
}, { timestamps: true });

mongoose.models = {};
export default mongoose.model("Product", ProductSchema);
