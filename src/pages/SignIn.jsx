import React, { useState, useEffect } from 'react';
import '../styles/components/SignIn.css';
import { FcGoogle } from 'react-icons/fc';
import model from '../assets/images/collab-image.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, loading, error } = useSelector((state) => state.auth);

  // Navigate on successful login
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  const handleGoogleLogin = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;
    window.location.href = url;
    //window.location.href = googleUrl;
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
              <button className="google-btn" onClick={handleGoogleLogin}>
                <FcGoogle size={20} /> Sign in with Google
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
              <button className="signin-button" type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <button
                className="register-button"
                type="button"
                onClick={() => navigate('/signup')}
              >
                Register Now
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <div className="extra-links"><a href="#">Forget Password?</a></div>
            <div className="terms">CAROAL Terms & Conditions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
