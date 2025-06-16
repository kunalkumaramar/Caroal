import React, { useState } from 'react';
import '../styles/components/SignIn.css';
import { FcGoogle } from 'react-icons/fc';
import { SiGmail } from 'react-icons/si';
import model from '../assets/images/collab-image.png';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const SignIn = () => {
  const { loginUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginUser(email, password);
    if (success) {
      navigate('/');
    } else {
      alert('Invalid Email or Password');
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-container fade-in-up">
        <div className="signin-left">
          <img src={model} alt="Models" />
        </div>
        <div className="signin-right">
          <div className="signin-box">
            <h1>CAROAL</h1>
            <h2>Sign In To COROAL</h2>
            <div className="signin-social">
              <button className="google-btn">
                <FcGoogle size={20} /> Sign in with Google
              </button>
              <button className="email-btn">
                <SiGmail size={20} color="#EA4335" /> Sign in with Gmail
              </button>
            </div>
            <div className="divider"><span>OR</span></div>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button className="signin-button" type="submit">Sign In</button>
              <button
                className="register-button"
                type="button"
                onClick={() => navigate('/signup')}
              >
                Register Now
              </button>
            </form>
            <div className="extra-links"><a href="#">Forget Password?</a></div>
            <div className="terms">CAROAL Terms & Conditions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
