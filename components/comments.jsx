import React from "react";
import { useState, useEffect } from "react";

const Comments = ({ productId, dataProduct }) => {
  //   console.log("product3", product.productName[0].title);
  console.log(productId);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]); // Estado para almacenar los comentarios;

  // Obtener los comentarios desde el backend cuando el componente se monte
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/${productId}`); // Ruta para obtener comentarios
        const data = await res.json();
        setComments(data.comments); // Asigna los comentarios a tu estado
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (productId) {
      fetchComments(); // Llamar a la función para obtener los comentarios
    }
  }, []);

  const submitComment = async (e) => {
    e.preventDefault();

    const comment = { productId, name, comment: message };

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });

      const data = await res.json();
      console.log("Response from API:", data); // Agrega esta línea para ver la respuesta

      if (res.ok) {
        alert("Comment submitted successfully!");
        setName("");
        setMessage("");
        setComments((prev) => [...prev, data.comment]); // Agregar nuevo comentario al estado
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting comment", error);
      alert("There was an error submitting your comment.");
    }
  };

  return (
    <>
      <section className="text-gray-600 body-font">
        <h2 className="text-lg font-semibold mb-4">Comments:</h2>
        <div className="space-y-4">
          {dataProduct.comments.length > 0 ? (
            dataProduct.comments.map((element, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
              >
                <p className="text-sm font-bold text-gray-900">
                  {element.name}:
                </p>
                <p className="text-gray-700 mt-1">{element.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet</p>
          )}
        </div>
      </section>

      <form onSubmit={submitComment} className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        />
        <textarea
          placeholder="Add your comment"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full p-2 h-24 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Comments;
