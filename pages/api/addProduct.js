import Product from '../../models/AddItem';
import connectDb from '../../middleware/mongoose';

const addProduct = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { title, slug, desc, img, category, colour, price, availableQty, userEmail, userName } = req.body;

            if (!title || !slug || !desc || !img || !category || !colour || !price || !availableQty || !userEmail || !userName) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const newProduct = new Product({
                title,
                slug,
                desc,
                img,
                category,
                colour, // Using 'colour' here
                price,
                availableQty,
                userEmail,
                userName,
            });

            const savedProduct = await newProduct.save();
            return res.status(201).json({ message: 'Product added successfully', data: savedProduct });
        } catch (error) {
            console.error('Error adding product:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
};

export default connectDb(addProduct);
