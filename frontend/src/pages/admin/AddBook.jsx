import { useState, useRef } from "react";
import api from "../../api";
import "./admin.css";

export default function AddBook() {
  const [form, setForm] = useState({ title:"", author:"", quantity:"" });
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [msg,     setMsg]     = useState("");
  const [msgType, setMsgType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      // Use FormData so we can send the image file
      const fd = new FormData();
      fd.append("title",    form.title.trim());
      fd.append("author",   form.author.trim());
      fd.append("quantity", Number(form.quantity) || 0);
      if (imageFile) fd.append("image", imageFile);

      await api.post("/books", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("Book added successfully");
      setMsgType("success");
      setForm({ title:"", author:"", quantity:"" });
      setImageFile(null);
      setImagePreview("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add book");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">➕ Add New Book</div>
      </div>

      <form onSubmit={handleSubmit} className="form">

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Book Title *</label>
            <input placeholder="e.g. The Alchemist" value={form.title} onChange={set("title")} required />
          </div>
          <div className="form-field">
            <label className="form-label">Author *</label>
            <input placeholder="e.g. Paulo Coelho" value={form.author} onChange={set("author")} required />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Quantity *</label>
          <input
            type="number" min="0" placeholder="e.g. 5"
            value={form.quantity} onChange={set("quantity")} required
            style={{ maxWidth:"160px" }}
          />
        </div>

        {/* Image upload */}
        <div className="form-field">
          <label className="form-label">Book Cover Image</label>
          <div
            className="img-upload-area"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="img-preview" />
            ) : (
              <>
                <div style={{ fontSize:"2rem", marginBottom:"8px" }}>🖼️</div>
                <div style={{ fontSize:".78rem", color:"#8B7355" }}>Click to upload a cover image</div>
                <div style={{ fontSize:".68rem", color:"#5a4d3a", marginTop:"4px" }}>JPG, PNG, WebP — max 5 MB</div>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display:"none" }}
            />
          </div>
          {imagePreview && (
            <button type="button" className="btn-outline" style={{ marginTop:"8px", fontSize:".72rem" }}
              onClick={() => { setImageFile(null); setImagePreview(""); if (fileRef.current) fileRef.current.value=""; }}>
              ✕ Remove image
            </button>
          )}
        </div>

        <div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Adding…" : "➕ Add Book"}
          </button>
        </div>
      </form>

      {msg && (
        <p className={`msg ${msgType === "success" ? "msg-success" : "msg-error"}`}>
          {msgType === "success" ? "✅" : "❌"} {msg}
        </p>
      )}
    </div>
  );
}
