import connectDb from '../../middleware/mongoose';
import Product from '../../models/comment'; // El modelo Product con el campo comments

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { name, message } = req.body;
        console.log(name);
        console.log(_id);
        console.log(message);
      // Validar que los campos necesarios estén presentes
      if (!name || !message) {
        return res.status(400).json({ error: 'Please provide productId, name, and message' });
      }

      // Encontrar el producto por su ID y agregar el nuevo comentario
      const product = await Product.findById(_id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Crear el comentario
      const newComment = { name, message };

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
