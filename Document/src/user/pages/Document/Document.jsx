import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Document.css";
import Spinner from "../../components/Spinner/Spinner";

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDocuments();

    const spinner = setTimeout(() => {
      setShowSpinner(false);
    }, 500);

    return () => clearTimeout(spinner);
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      // ❌ No auth token — allow public access
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/document`);

      const publicDocs = res.data.documents
        .filter((doc) => doc.isPublic === true)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // latest first

      setDocuments(publicDocs);
      setFilteredDocs(publicDocs);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(query)
    );

    setFilteredDocs(filtered);
  };

  if (showSpinner) return <Spinner />;

  return (
    <div className="document-container">
      <h2 className="document-heading">Public Documents</h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      {loading ? (
        <p className="loading-text">Loading documents...</p>
      ) : filteredDocs.length === 0 ? (
        <p className="no-docs">No documents found for "{searchQuery}"</p>
      ) : (
        <div className="document-list">
          {filteredDocs.map((doc) => (
            <div key={doc._id} className="document-card">
              {/* 🔗 Shareable Link */}
              <Link to={`/document/${doc._id}`} className="doc-title-link">
                <h3 className="doc-title">{doc.title}</h3>
              </Link>
              <p className="doc-content">{doc.content}</p>
              <div className="doc-meta">
                <span>Author: {doc.author?.name || "Unknown"}</span>
                <span>
                  Created:{" "}
                  {doc.createdAt
                    ? new Date(doc.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <p className="share-link">
                Share:{" "}
                <code>
                  {`${window.location.origin}/document/${doc._id}`}
                </code>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Document;
