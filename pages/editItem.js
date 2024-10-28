import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const EditItem = () => {
    const router = useRouter();
    const { id } = router.query; // Retrieve the ID from query parameters
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            fetchProductData(id); // Fetch product data when ID is available
        }
    }, [id]);

    const fetchProductData = async (productId) => {
        try {
            const response = await fetch(`/api/getProduct?id=${productId}`);
            if (!response.ok) {
                throw new Error(`Error fetching product data: ${response.statusText}`);
            }
            const data = await response.json();
            setProduct(data.product);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {product ? (
                <div>
                    <h1>Edit Product</h1>
                    <form>
                        {/* Add form fields populated with product data */}
                        <input type="text" value={product.title} readOnly />
                        {/* Add other fields as needed */}
                    </form>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditItem;
