import mongoose from 'mongoose';

// Define el esquema de comentario
const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
});

// Define el esquema de producto
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  category: { type: String, required: true },
  colour: { type: String },
  price: { type: Number, required: true },
  availableQty: { type: Number, required: true },
  comments: [CommentSchema], // Campo de comentarios (array de objetos)
}, { timestamps: true });

// Evita la sobreescritura del modelo 'products'
export default mongoose.models.products || mongoose.model('products', ProductSchema);
