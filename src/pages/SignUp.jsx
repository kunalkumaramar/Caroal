import React, { useState} from 'react';
import '../styles/components/SignIn.css';
import { FcGoogle } from 'react-icons/fc';
import model from '../assets/images/collab-image.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/authSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const { confirmPassword, ...userData } = formData;

    const res = await dispatch(signupUser(userData));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/signin');
    }
  };
  const handleGoogleLogin = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;
    window.location.href = url;
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
            <h2>Create Account</h2>

            <div className="signin-social" onClick={handleGoogleLogin}>
              <button className="google-btn"><FcGoogle size={20} /> Sign up with Google</button>
            </div>

            <div className="divider"><span>OR</span></div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  onChange={handleChange}
                  value={formData.firstName}
                  required
                />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  onChange={handleChange}
                  value={formData.lastName}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  value={formData.phone}
                  required
                />
              </div>

              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                required
                style={{ marginTop: '10px' }}
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
                style={{ marginTop: '10px' }}
              />

              <button className="signin-button" type="submit" style={{ marginTop: '10px' }} disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <div className="extra-links" style={{ marginTop: '20px' }}>
              Already have an account?{' '}
              <span
                onClick={() => navigate('/signin')}
                style={{ color: '#5B86E5', cursor: 'pointer' }}
              >
                Login
              </span>
            </div>

            <div className="terms">CAROAL Terms & Conditions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
