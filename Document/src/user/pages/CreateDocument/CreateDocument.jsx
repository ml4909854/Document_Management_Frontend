import React, { useState , useEffect } from "react";
import axios from "axios";
import "./createdocument.css";
import Spinner from "../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";

const CreateDocument = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const navigate = useNavigate()
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const spinner = setTimeout(() => {
      setShowSpinner(false);
    }, 500);

    return () => {
      clearTimeout(spinner);
    };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/document/create`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Document created!");
      navigate("/document")
      setForm({ title: "", content: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create document");
    } finally {
      setLoading(false);
    }
  };
if (showSpinner) {
    return <Spinner />;
  }

  return (
    <div className="create-doc-container">
      <h2>Create New Document</h2>
      <form className="create-doc-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Document Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Write your content here..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={8}
        ></textarea>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Document"}
        </button>
      </form>
    </div>
  );
};

export default CreateDocument;
