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
        color: '',
        price: '',
        availableQty: '',
    });
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Black', 'White'];
    const categories = ['Home Decor', 'Pottery', 'Ceramics', 'Embroidery'];

    const fetchData = async (token) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            if (response.ok) {
                const res = await response.json();
                console.log("User Data Response:", res); // Log the entire response
                // Directly access name and email from res
                setUserName(res.name || ''); // Update this line
                setUserEmail(res.email || ''); // Update this line
                console.log("User Name:", res.name); // Log userName
                console.log("User Email:", res.email); // Log userEmail
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

        // Log the submission data to the console for debugging
        console.log("Submission Data:", submissionData);

        // I am getting an error on line 61 and 70 that all fields are required
        // I think the error is from the slug field will debug and test it because everything else works fine
        
        try {
            const response = await fetch('/api/addProduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
            if (response.ok) {
                router.push('/success');
            } else {
                const errorResponse = await response.json();
                console.error("Error:", errorResponse.message || "Submission failed.");
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
        
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, img: reader.result })); // Save Base64 string to formData
        };
        if (file) {
            reader.readAsDataURL(file); // Convert image file to Base64
        }
    };

    useEffect(() => {
        const myuser = JSON.parse(localStorage.getItem('myuser'));
        if (myuser?.token) fetchData(myuser.token);
    }, []);

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
                <select name="color" value={formData.color} onChange={handleChange} required>
                    <option value="" disabled>Select Color</option>
                    {colors.map(color => <option key={color} value={color}>{color}</option>)}
                </select>
                <input type="file" name="img" onChange={handleImageChange} />

                {/* Hidden input fields for userName and userEmail */}
                <input type="hidden" name="userName" value={userName} />
                <input type="hidden" name="userEmail" value={userEmail} />

                <button type="submit" className="bg-pink-500 text-white py-2 px-6 rounded mt-2">Submit</button>
            </form>
        </div>
    );
};

export default AddItem;
