import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function AddProductScreen() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");

  const selectPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const createProduct = async () => {
    if (!image || !name || !price || !category || !description || !brand || !countInStock) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("countInStock", countInStock);
      formData.append("image", image);

      const response = await fetch("http://192.168.29.144:4000/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create product");

      alert("Product added successfully!");
      console.log(await response.json());

      setName("");
      setPrice("");
      setDescription("");
      setBrand("");
      setCategory("");
      setCountInStock("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.uploadContainer}>
        <input type="file" accept="image/*" onChange={selectPhoto} style={styles.hiddenInput} />
        {preview ? (
          <img src={preview} alt="Preview" style={styles.previewImage} />
        ) : (
          <div style={styles.placeholder}>
            <FaCloudUploadAlt size={50} color="#007bff" />
            <p>Click to Upload Image</p>
          </div>
        )}
      </label>
      <input style={styles.input} placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input style={styles.input} placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input style={styles.input} placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input style={styles.input} placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
      <input style={styles.input} placeholder="Count In Stock" type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
      <textarea style={styles.textarea} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button style={styles.button} onClick={createProduct}>List Product</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "450px",
    margin: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    maxHeight: "80vh", // Set a fixed height for scrolling
    overflowY: "auto",
    paddingBottom: "80px", // Ensure space for button
    position: "relative",
  },
  uploadContainer: {
    textAlign: "center",
    padding: "12px",
    border: "2px dashed #007bff",
    borderRadius: "8px",
    background: "#f8f9fa",
    cursor: "pointer",
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  hiddenInput: {
    display: "none",
  },
  previewImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  placeholder: {
    padding: "24px",
    fontSize: "16px",
    color: "#666",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "100%",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "100%",
    height: "120px",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  buttonContainer: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    textAlign: "center",
    background: "#fff",
    padding: "10px 0",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "18px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 4px 8px rgba(0, 123, 255, 0.3)",
  },
};
