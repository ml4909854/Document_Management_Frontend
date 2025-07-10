import React, { useEffect, useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";
import Spinner from "../../components/Spinner/Spinner";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSpinner , setShowSpinner] = useState(true)
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(()=>{
   let spinner = setTimeout(() => {
        setShowSpinner(false)
   }, 500);
   return ()=>{
    clearTimeout(spinner)
   }
  },[])

  if(showSpinner){
    return <Spinner/>
  }

 const handleForgot = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/user/forgot-password`,
      { email }
    );
    alert(res.data.message)
    setMessage(res.data.message);
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgot}>
        <input className="forgot-input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        {error && <p style={{color:"red"}} className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <button className="forgot-button" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
