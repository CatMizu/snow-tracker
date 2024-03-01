import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import { useAuth } from "../../utils/auth";
import {
  validatePassword,
  getInvalidDetails,
} from "../../utils/passwordValidator";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const auth = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!validatePassword(password)) {
      alert(getInvalidDetails(password));
      return;
    }

    try {
      await auth.signUp(name, email, password);
      alert("Congratulations, your account has been successfully created.")
      navigate("/");
    } catch (error) {
      console.error("sign up failed", error);
      alert(`sign up failed: ${error}`);
    }
  };

  return (
    <div className={styles.signup}>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign up</button>
        <Link to="/" className={styles.signupLink}>
          Back to sign in
        </Link>
      </form>
    </div>
  );
}

export default Signup;
