import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AddItem = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        desc: '',
        img: '',
        category: '',
        colour: '', // Using 'colour' here
        price: '',
        availableQty: '',
    });
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [notification, setNotification] = useState({ message: '', type: '', countdown: 4 });

    const colours = ['red', 'blue', 'pink', 'green', 'yellow'];
    const categories = ['home decor', 'pottery', 'ceramics', 'embroidery'];

    const createRandomSlug = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let slug = '';
        for (let i = 0; i < 6; i++) {
            slug += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return slug;
    };

    useEffect(() => {
        setFormData(prev => ({ ...prev, slug: createRandomSlug() }));

        const myuser = JSON.parse(localStorage.getItem('myuser'));
        if (myuser?.token) fetchData(myuser.token);
    }, []);

    useEffect(() => {
        if (notification.type === 'success') {
            const timer = setInterval(() => {
                setNotification(prev => ({
                    ...prev,
                    countdown: prev.countdown - 1,
                }));
            }, 1000);

            if (notification.countdown === 0) {
                clearInterval(timer);
                router.push('/sellerPortal');
            }

            return () => clearInterval(timer);
        }
    }, [notification, router]);

    const fetchData = async (token) => {
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
            } else {
                console.error("Failed to fetch user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = { ...formData, userName, userEmail };

        console.log("Form Data to Submit:", submissionData);

        try {
            const response = await fetch('/api/addProduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
            if (response.ok) {
                setNotification({ message: "Submission successful!", type: 'success', countdown: 4 });
            } else {
                const errorResponse = await response.json();
                setNotification({ message: `Submission failed: ${errorResponse.message || "Submission failed."}`, type: 'error' });
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            setNotification({ message: "Error submitting data. Please try again.", type: 'error' });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, img: reader.result }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-1">Add Item</h1>
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
                <select name="colour" value={formData.colour} onChange={handleChange} required> {/* Using 'colour' here */}
                    <option value="" disabled>Select Colour</option>
                    {colours.map(colour => <option key={colour} value={colour}>{colour}</option>)}
                </select>
                <input type="file" name="img" onChange={handleImageChange} />

                <input type="hidden" name="slug" value={formData.slug} />
                <input type="hidden" name="userName" value={userName} />
                <input type="hidden" name="userEmail" value={userEmail} />

                <button type="submit" className="bg-pink-500 text-white py-2 px-6 rounded mt-2">Submit</button>
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

export default AddItem;
