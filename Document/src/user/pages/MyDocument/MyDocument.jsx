import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./mydocument.css";
import Spinner from "../../components/Spinner/Spinner";

const MyDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });
  const [saveStatus, setSaveStatus] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [error, setError] = useState("");

  const debounceTimer = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/document/ownDocument`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      // ✅ Updated to match backend's response key
      const sorted = response.data.document.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDocuments(sorted);
    } catch (err) {
      console.error("Document fetch error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load documents. Please try again later."
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        // Optionally redirect to login
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const startEdit = (doc) => {
    setEditingDocId(doc._id);
    setEditData({ title: doc.title, content: doc.content });
    setSaveStatus("");
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      autoSaveDocument();
    }, 1000);
  };

  const autoSaveDocument = async () => {
    if (!editingDocId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSaveStatus("Authentication required");
        return;
      }

      setSaveStatus("Saving...");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/document/update/${editingDocId}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaveStatus("Saved");
      fetchDocuments();
    } catch (err) {
      console.error("Save failed", err);
      setSaveStatus("Failed to save: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this document?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/document/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDocuments();
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/document/toggle-visibility/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDocuments();
    } catch (err) {
      console.error("Toggle failed", err);
      setError("Failed to toggle: " + (err.response?.data?.message || err.message));
    }
  };

  if (showSpinner) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="mydoc-container">
        <h2>My Documents</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="mydoc-container">
      <h2>My Documents</h2>

      {loading ? (
        <div className="loading-container">
          <Spinner size="small" />
          <p>Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <p>No documents found. Create your first document!</p>
      ) : (
        documents.map((doc) =>
          editingDocId === doc._id ? (
            <div className="mydoc-card editing" key={doc._id}>
              <input
                className="doc-title-input"
                value={editData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <textarea
                className="doc-content-input"
                value={editData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                rows={5}
              />
              <div className="editing-controls">
                <p className="save-status">{saveStatus}</p>
                <button className="cancel-btn" onClick={() => setEditingDocId(null)}>
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className="mydoc-card" key={doc._id}>
              <h3>{doc.title}</h3>
              <p>{doc.content}</p>
              <div className="doc-meta">
                <span><strong>Author:</strong> {doc.author?.name || "You"}</span>
                <span><strong>Created:</strong> {new Date(doc.createdAt).toLocaleString()}</span>
                <span><strong>Status:</strong> {doc.isPublic ? "Public" : "Private"}</span>
              </div>
              <div className="doc-buttons">
                <button className="edit-btn" onClick={() => startEdit(doc)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(doc._id)}>Delete</button>
                <button className="toggle-btn" onClick={() => handleToggle(doc._id)}>
                  {doc.isPublic ? "Make Private" : "Make Public"}
                </button>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default MyDocument;
