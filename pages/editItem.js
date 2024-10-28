import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const EditItem = () => {
    const router = useRouter();
    const { id } = router.query;
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        desc: '',
        img: '',
        category: '',
        colour: '',
        price: '',
        availableQty: '',
    });
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [notification, setNotification] = useState({ message: '', type: '', countdown: 4 });
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState("");

    const colours = ['red', 'blue', 'pink', 'green', 'yellow'];
    const categories = ['home decor', 'pottery', 'ceramics', 'embroidery'];

    useEffect(() => {
        if (id) fetchProductData(id);
    }, [id]);

    const fetchProductData = async (productId) => {
        try {
            const response = await fetch(`/api/getProduct?id=${productId}`);
            if (!response.ok) throw new Error(`Error fetching product data: ${response.statusText}`);
            const data = await response.json();
            const product = data.product;
            setFormData({
                title: product.title,
                slug: product.slug,
                desc: product.desc,
                img: product.img,
                category: product.category,
                colour: product.colour,
                price: product.price,
                availableQty: product.availableQty,
            });
            setUserName(product.userName);
            setUserEmail(product.userEmail);
            setPreviewImage(product.img);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, img: reader.result }));
            setPreviewImage(reader.result);
        };
        if (file) reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = { ...formData, userName, userEmail };

        try {
            const response = await fetch(`/api/editProduct?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
            if (response.ok) {
                setNotification({ message: "Product updated successfully!", type: 'success', countdown: 3 });
            } else {
                const errorResponse = await response.json();
                setNotification({ message: `Update failed: ${errorResponse.message || "Update failed."}`, type: 'error' });
            }
        } catch (error) {
            console.error("Error updating data:", error);
            setNotification({ message: "Error updating data. Please try again.", type: 'error' });
        }
    };

    useEffect(() => {
        if (notification.type === 'success') {
            const timer = setInterval(() => {
                setNotification(prev => ({ ...prev, countdown: prev.countdown - 1 }));
            }, 1000);
            if (notification.countdown === 0) {
                clearInterval(timer);
                router.push('/sellerPortal');
            }
            return () => clearInterval(timer);
        }
    }, [notification, router]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-1">Edit Item</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                {['title', 'desc', 'price', 'availableQty'].map(field => (
                    <input
                        key={field}
                        type={field === 'price' || field === 'availableQty' ? 'number' : 'text'}
                        name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        className="border border-gray-300 p-4 rounded-md mb-2"
                        value={formData[field]}
                        onChange={handleChange}
                        required
                    />
                ))}
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select name="colour" value={formData.colour} onChange={handleChange} required>
                    <option value="" disabled>Select Colour</option>
                    {colours.map(colour => <option key={colour} value={colour}>{colour}</option>)}
                </select>
                <input type="file" name="img" onChange={handleImageChange} />

                {previewImage && (
                    <div className="my-2">
                        <img src={previewImage} alt="Product Preview" className="w-32 h-32 object-cover rounded-md" />
                        <button type="button" onClick={() => setPreviewImage(null)} className="text-red-500 mt-1">
                            Remove Image
                        </button>
                    </div>
                )}

                <button type="submit" className="bg-pink-500 text-white py-2 px-6 rounded mt-2">Update</button>
            </form>

            {notification.message && (
                <div className={`fixed bottom-4 right-4 p-4 rounded shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {notification.message}
                    {notification.type === 'success' && <div>Redirecting in {notification.countdown} seconds...</div>}
                </div>
            )}
        </div>
    );
};

export default EditItem;
