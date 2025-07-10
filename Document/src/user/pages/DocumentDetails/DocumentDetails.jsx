import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner/Spinner";
import "./documentDetails.css";

const DocumentDetails = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // Optional for private/shared docs
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/document/${id}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {}, // allow public access without token
          }
        );
        setDocument(res.data.document);
      } catch (err) {
        console.error("Error fetching document", err);
        setError(
          err.response?.data?.message || "Failed to fetch the document."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="document-detail-container">
      <h2>{document.title}</h2>
      <p>{document.content}</p>
      <div className="doc-meta">
        <span>Author: {document.author?.name || "Unknown"}</span>
        <span>
          Created:{" "}
          {document.createdAt
            ? new Date(document.createdAt).toLocaleString()
            : "N/A"}
        </span>
        <span>Status: {document.isPublic ? "Public" : "Private"}</span>
      </div>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Share this link: <code>{window.location.href}</code>
      </p>
    </div>
  );
};

export default DocumentDetails;
