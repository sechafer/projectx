import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const SellerPortal = () => {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [products, setProducts] = useState([]); // Store user's products

    useEffect(() => {
        const myuser = JSON.parse(localStorage.getItem('myuser'));
        if (myuser?.token) fetchUserData(myuser.token);
    }, []);

    // Function to fetch user name and email
    const fetchUserData = async (token) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            if (response.ok) {
                const res = await response.json();
                setUserName(res.name || '');
                setUserEmail(res.email || '');
                // Fetch products after setting userName and userEmail to only pull products for the user
                fetchUserProducts(res.name || '', res.email || '');
            } else {
                console.error("Failed to fetch user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Function to fetch products with matching user
    const fetchUserProducts = async (name, email) => {
        try {
            const response = await fetch('/api/getUserProducts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: name, userEmail: email }),
            });
            if (response.ok) {
                const result = await response.json();
                setProducts(result.products || []);
            } else {
                console.error("Error fetching products:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Function to handle the deletion of a product
    const handleDeleteProduct = async (productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`/api/deleteProduct`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId }),
                });
                if (response.ok) {
                    setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
                } else {
                    console.error("Error deleting product:", response.statusText);
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    // Function to handle editing a product
    const handleEditProduct = (productId) => {
        router.push(`/editItem?id=${productId}`);
    };

    const handleAddItemClick = () => {
        router.push('/addItem');
    };

    return (
        <div className="flex flex-col items-center">
            <h1>Seller Portal</h1>
            <div className="text-center my-4">
                <h2>Welcome, {userName}</h2>
            </div>
            <div className="text-center my-4">
                <h2>Sell Your Items</h2>
                <button
                    onClick={handleAddItemClick}
                    className="disabled:bg-pink-300 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded mt-2"
                >
                    Add Item
                </button>
            </div>
            <div id="yourItems" className="text-center my-4">
                <h2>Your Items</h2>
                {products.length === 0 ? (
                    <p>No items found.</p>
                ) : (
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">Image</th>
                                <th className="border border-gray-300 p-2">Product Name</th>
                                <th className="border border-gray-300 p-2">Price</th>
                                <th className="border border-gray-300 p-2">Quantity</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2">
                                        <img src={product.img} alt={product.title} className="h-16 w-16 object-cover" />
                                    </td>
                                    <td className="border border-gray-300 p-2">{product.title}</td>
                                    <td className="border border-gray-300 p-2">${product.price}</td>
                                    <td className="border border-gray-300 p-2">{product.availableQty}</td>
                                    <td className="border border-gray-300 p-2">
                                        <button
                                            className="bg-blue-500 text-white py-1 px-3 rounded"
                                            onClick={() => handleEditProduct(product._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-1 px-3 rounded ml-2"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SellerPortal;
