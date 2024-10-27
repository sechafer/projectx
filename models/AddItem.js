import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, unique: true }, // removed required
        desc: { type: String, required: true },
        img: { type: String, required: true },
        category: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true },
        availableQty: { type: Number, required: true },
        userEmail: { type: String, required: true },  // This will be populated from formData in handleSubmit
        userName: { type: String, required: true },   // This will also be populated from formData in handleSubmit
    },
    { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("Product", ProductSchema);
