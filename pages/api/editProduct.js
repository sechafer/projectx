import Product from '../../models/AddItem';
import connectDb from '../../middleware/mongoose';

const editProduct = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { title, slug, desc, img, category, colour, price, availableQty, userEmail, userName } = req.body;

            if (!title || !slug || !desc || !category || !colour || !price || !availableQty || !userEmail || !userName) {
                return res.status(400).json({ message: 'All fields except image are required.' });
            }

            const updateData = {
                title,
                slug,
                desc,
                category,
                colour,
                price,
                availableQty,
                userEmail,
                userName
            };

            if (img) {
                updateData.img = img; // Only update image if a new one is provided if not leave the existing image
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            return res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
};

export default connectDb(editProduct);
