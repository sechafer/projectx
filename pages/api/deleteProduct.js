import connectDb from '../../middleware/mongoose';
import Product from '../../models/AddItem';

const deleteProduct = async (req, res) => {
    if (req.method === 'DELETE') {
        const { productId } = req.body;

        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ message: "Server error" });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default connectDb(deleteProduct);
