import React from "react";
import { useState } from 'react';

const Comments = ({_id}) => {
//   console.log("product3", product.productName[0].title);
const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const submitComment = async (e) => {
    e.preventDefault();

    const comment = { name, message };

    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Comment submitted successfully!');
        setName('');
        setMessage('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error submitting comment', error);
      alert('There was an error submitting your comment.');
    }
  };

  return (
    <form onSubmit={submitComment}>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Your comment"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Comments;
