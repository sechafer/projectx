import connectDb from '../../middleware/mongoose';
import Product from '../../models/AddItem';

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        const { id, title, desc, img, price, availableQty } = req.body;

        // Validate input
        if (!id || !title || !desc || !img || price === undefined || availableQty === undefined) {
            return res.status(400).json({ message: "All fields are required." });
        }

        try {
            // Find the product by ID and update it
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { title, desc, img, price, availableQty },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found." });
            }

            return res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
        } catch (error) {
            console.error("Error updating product:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

// Connect to the database before handling the request
export default connectDb(handler);
