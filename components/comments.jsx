import React, { useState, useEffect } from "react";

const Comments = ({ productId, dataProduct }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState(dataProduct.comments || []); // Estado inicial con los comentarios de dataProduct

  // Función para enviar el comentario
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
      console.log("Response from API:", data);

      if (res.ok) {
        alert("Comment submitted successfully!");
        setName("");
        setMessage("");

        // Aquí aseguramos que se actualicen los comentarios del array en la respuesta
        if (data.comments) {
          setComments(data.comments); // Reemplazamos el array completo con los comentarios actualizados
        }
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
          {comments.length > 0 ? (
            comments.map((element, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
              >
                <p className="text-sm font-bold text-gray-900">{element.name}:</p>
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
