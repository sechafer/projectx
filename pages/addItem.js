//TODO: The code bellow works to retrieve the user data from the API.
//but it does not pull the user ID from the API.
//maybe i should use the user name as foreign key in the item schema.
//or maybe i should use the user email as foreign key in the item schema.
//ideally i should use the user ID as foreign key in the item schema. need to figure out how to do that.
//there is an error in the console when trying to retrieve the user ID from the API.

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const AddItem = () => {
    const router = useRouter();

    const fetchData = async (token) => {
        let data = { token: token };
        let response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        let res = await response.json();

        if (res.success) {
            // Log all user information
            console.log("User Information:", res.data); // Adjust based on your API response structure
        } else {
            console.error("Error fetching user data:", res.message);
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

    return (
        <>
            <h1>Add Item</h1>
        </>
    );
}

export default AddItem;

//


/*
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