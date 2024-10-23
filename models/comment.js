import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String,unique:true, required: true },
    desc : { type: String, required: true },
    img : { type: String, required: true },
    category : { type: String, required: true },
    colour : { type: String },
    price : { type: Number, required:true  },
    availableQty : { type: Number, required:true  },
    comments: [CommentSchema] // Campo de comentarios (array de objetos)
}, {timestamps:true});

export default mongoose.models.Product || mongoose.model('products', ProductSchema);
