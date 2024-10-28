import connectDb from '../../middleware/mongoose';
import Product from '../../models/AddItem';

const getUserProducts = async (req, res) => {
    if (req.method === 'POST') {
        const { userName, userEmail } = req.body;

        console.log(`Fetching products for user: ${userName}, email: ${userEmail}`); 

        try {
            const products = await Product.find({
                userName,
                userEmail,
            });

            // Log each product's data
            products.forEach(product => {
                console.log("Product data:", product);
            });

            if (products.length === 0) {
                console.log('No items found for this user');
                return res.status(404).json({ message: 'No items found' });
            }

            console.log(`Found ${products.length} items for user ${userName}`);
            return res.status(200).json({ products });
        } catch (error) {
            console.error("Error fetching user products:", error);
            return res.status(500).json({ message: "Server error" });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
};

export default connectDb(getUserProducts);
