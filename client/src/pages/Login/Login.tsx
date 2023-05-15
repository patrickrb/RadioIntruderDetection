import React, { useState, FormEvent } from "react";
import axios from "axios";

interface Payload {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload: Payload = {
      email,
      password,
    };

    try {
      // Make a request to your backend API
      const response = await axios.post("http://localhost/login", payload);

      // Store the returned token for future authenticated requests
      console.log("got response: ", response.data.token);
      localStorage.setItem("authToken", response.data.token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
