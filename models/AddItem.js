import Order from '../pages/addItem';

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true }, //Do we need this?
    desc: { type: String, required: true },
    img: { type: String, required: true },
    category: { type: String, required: true },
    colour: { type: String },//Do we need this?
    price: { type: Number, required: true },
    availableQty: { type: Number, required: true }
}, { timestamps: true });

mongoose.models = {}
export default mongoose.model("Product", ProductSchema);