import connectDb from '../../middleware/mongoose';
import Product from '../../models/AddItem';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const { id } = req.query; // Get product ID from query

        if (!id) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        try {
            const product = await Product.findById(id); // Fetch product by ID

            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            return res.status(200).json({ product });
        } catch (error) {
            console.error("Error fetching product:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default connectDb(handler);
