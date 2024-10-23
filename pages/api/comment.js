import mongoose from 'mongoose';
import connectDb from '../../middleware/mongoose';
import Product from '../../models/comment'; // Asegúrate de que este sea el modelo correcto


const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { productId, name, comment: message } = req.body;
      console.log("Received comment:", { productId, name, message }); // Agrega esta línea
      console.log("Received body:",req.body)
      // Convertir productId a ObjectId
      const productObjectId = mongoose.Types.ObjectId(productId);
      console.log("Converted productId:", productObjectId);  
      // Validar que los campos necesarios estén presentes
      if (!name || !message) {
        return res.status(400).json({ error: 'Please provide productId, name, and message' });
      }

      // Encontrar el producto por su ID y agregar el nuevo comentario
      const product = await Product.findById(productObjectId);
      console.log("product: ",product);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Asegúrate de que product.comments es un array
      if (!Array.isArray(product.comments)) {
        product.comments = []; // Inicializa como un array vacío si no existe
      }

      // Crear el comentario
      const newComment = { name, comment: message };

      // Insertar el comentario en el array de comentarios del producto
      product.comments.push(newComment);

      // Guardar el producto con el nuevo comentario
      await product.save();

      // Responder con el producto actualizado
      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default connectDb(handler);
