//TODO: The code bellow works to retrieve the user data from the API.
//but it does not pull the user ID from the API.
//maybe i should use the user name as foreign key in the item schema.
//or maybe i should use the user email as foreign key in the item schema.
//ideally i should use the user ID as foreign key in the item schema. need to figure out how to do that.
//there is an error in the console when trying to retrieve the user ID from the API.

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

    const commonColors = [
        { name: 'Red', hex: '#FF0000' },
        { name: 'Green', hex: '#00FF00' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
    ];

    const categoryOptions = [
        { name: 'Home Decor' },
        { name: 'Pottery' },
        { name: 'Ceramics' },
        { name: 'Embriodery'},
    ];

    const fetchData = async (token) => {
        try {
            const data = { token: token };
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.error("Fetch error:", response.statusText);
                return;
            }

            const res = await response.json();
            const userInfo = res.data || res;
            if (userInfo && userInfo.email && userInfo.name) {
                setUserName(userInfo.name);
                setUserEmail(userInfo.email);
            } else {
                console.error("Unexpected response structure:", res);
            }
        } catch (error) {
            console.error("FetchData Error:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            // this will update slug based on color selection
            slug: name === "color" ? value.toLowerCase() : prevData.slug,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                img: URL.createObjectURL(file),
            }));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                img: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to submit form data, e.g., send to API
        console.log("Form submitted:", formData);
        console.log("User Email:", userEmail);
        console.log("User Name:", userName);
    };

    useEffect(() => {
        const myuser = JSON.parse(localStorage.getItem('myuser'));
        if (!myuser) {
            router.push('/'); // Redirect if no user is found
        } else if (myuser.token) {
            fetchData(myuser.token); // Fetch user data
        }
    }, [router]);

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 class="text-black-900 text-4xl title-font font-medium mb-1">Add Item</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <label>Item Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        className="border border-gray-300 p-4 rounded-md text-center"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Item Slug</label>
                    <input
                        type="text"
                        name="slug"
                        placeholder="Will update automatically"
                        className="border border-gray-300 p-4 rounded-md text-center"
                        value={formData.slug}
                        readOnly
                        required
                    />

                    <label>Item Description</label>
                    <textarea
                        name="desc"
                        placeholder="Description"
                        className="border border-gray-300 p-4 rounded-md text-center"
                        value={formData.desc}
                        onChange={handleChange}
                        required
                    />

                    <label>Add Picture</label>
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border border-gray-300 p-4 rounded-md text-center"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        {formData.img && (
                            <img src={formData.img} alt="Uploaded preview" className="mt-2 w-24 h-24 object-cover" />
                        )}
                    </div>

                    <label>Item Category</label>
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        className="border border-gray-300 p-4 rounded-md text-center"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />

                    <label>Item Color</label>
                    <select
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        required
                        className="flex items-center"
                    >
                        <option value="" disabled>Select Color</option>
                        {commonColors.map((color) => (
                            <option key={color.hex} value={color.name}>
                                {color.name}
                            </option>
                        ))}
                    </select>
                    {formData.color && (
                        <span
                            style={{
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: commonColors.find(c => c.name === formData.color)?.hex,
                                marginLeft: '8px'
                            }}
                        />
                    )}

                    <label>Item Price</label>
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="border border-gray-300 p-4 rounded-md text-center"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />

                    <label>Available Quantity</label>
                    <input
                        type="number"
                        name="availableQty"
                        placeholder="Available Quantity"
                        className="border border-gray-300 p-4 rounded-md text-center"
                        value={formData.availableQty}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="flex disabled:bg-pink-300 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded mt-2"
                    >
                        Submit
                    </button>
                </form>
            </div>
            <p>User Email: {userEmail}</p>
            <p>User Name: {userName}</p>
        </>
    );
};

export default AddItem;



/*
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AddItem = () => {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
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

    const fetchData = async (token) => {
        try {
            const data = { token: token };
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.error("Fetch error:", response.statusText);
                return;
            }

            const res = await response.json();
            const userInfo = res.data || res;
            if (userInfo && userInfo.email && userInfo.name) {
                setUserName(userInfo.name);
                setUserEmail(userInfo.email);
            } else {
                console.error("Unexpected response structure:", res);
            }
        } catch (error) {
            console.error("FetchData Error:", error);
        }
    };

    useEffect(() => {
        const myuser = JSON.parse(localStorage.getItem('myuser'));
        if (!myuser) {
            router.push('/');
        } else if (myuser.token) {
            fetchData(myuser.token);
        }
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", {
            ...formData,
            userName,
            userEmail,
        });
    };

    

    return (
        <>
            <div className="flex flex-col items-center">
                <h1>Add Item</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <label>Item Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <label>Item Slug</label>
                    <input
                        type="text"
                        name="slug"
                        placeholder="Will update automatically"
                        value={formData.slug}
                        onChange={handleChange}
                        readOnly
                        required
                    />
                    <label>Item Description</label>
                    <textarea
                        name="desc"
                        placeholder="Description"
                        value={formData.desc}
                        onChange={handleChange}
                        required
                    />
                    <label>Add Picture</label>
                    <input
                        type="text"
                        name="img"
                        placeholder="Image URL"
                        value={formData.img}
                        onChange={handleChange}
                        required
                    />
                    <label>Item Category</label>
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                    <label>Item Color</label>
                    <input
                        type="text"
                        name="color"
                        placeholder="Color"
                        value={formData.color}
                        onChange={handleChange}
                    />
                    <label>Item Price</label>
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <label>Available Quantity</label>
                    <input
                        type="number"
                        name="availableQty"
                        placeholder="Available Quantity"
                        value={formData.availableQty}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="flex disabled:bg-pink-300 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded mt-2">Submit</button>
                </form>
            </div>
            <p>User Email: {userEmail}</p>
            <p>User Name: {userName}</p>
        </>
    );
}

export default AddItem;



import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


const AddItem = () => {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const fetchData = async (token) => {
        try {
            const data = { token: token };
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.error("Fetch error:", response.statusText);
                return;
            }

            const res = await response.json();
            //console.log("Parsed Response:", res);

            // Check for email and name at both res.data and root level
            const userInfo = res.data || res;
            if (userInfo && userInfo.email && userInfo.name) {
                setUserName(userInfo.name);
                setUserEmail(userInfo.email);
                //console.log("User Email:", userInfo.email);
                //console.log("User Name:", userInfo.name);
            } else {
                console.error("Unexpected response structure:", res);
            }
        } catch (error) {
            console.error("FetchData Error:", error);
        }
    };

    useEffect(() => {
        const myuser = JSON.parse(localStorage.getItem('myuser'));
        if (!myuser) {
            router.push('/'); // Redirect if no user is found
        } else if (myuser.token) {
            fetchData(myuser.token); // Fetch user data
        }
    }, [router]);

    //console.log("Stored User Name:", userName);
    //console.log("Stored User Email:", userEmail);

    return (
        <>
            <h1>Add Item</h1>
        </>
    );
}

export default AddItem;

//



import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import mongoose from 'mongoose';
import AddItem from '../models/AddItem';

const AddItem = () => {

    return (
        <>
            <h1>Add Item</h1>
        </>
    );
}

export default AddItem
*/