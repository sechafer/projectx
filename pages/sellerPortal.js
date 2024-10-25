import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const SellerPortal = () => {
    const router = useRouter();

    const userId = router.query.userId;
    console.log(userId);

    const handleAddItemClick = () => {
        router.push('/addItem');
    };

    return (
        <> 
            <div className="flex flex-col items-center">
                <h1>Seller Portal</h1>
                <div className="text-center my-4">
                    <h2>Sell your Items</h2>
                    <button onClick={handleAddItemClick} className="flex disabled:bg-pink-300 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded mt-2">
                        Add Item
                    </button>
                </div>
                <div className="text-center my-4">
                    <h2>Your Items</h2>
                </div>
            </div>
            
        </>
    );
}

export default SellerPortal
