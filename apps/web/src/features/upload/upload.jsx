import { useState } from "react";

function ImageUpload() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // backend should return { url: "https://s3-bucket-url/image.jpg" }
      setImageUrl(data.url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {loading && <p>Uploading...</p>}

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded Image</h3>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ width: "300px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
