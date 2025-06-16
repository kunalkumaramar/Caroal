import React, { useState } from 'react';
import '../styles/components/Collaboration.css'; // make sure this file exists
import influencerImg from '../assets/images/collab-image.png'; // adjust path as needed
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Collaboration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    youtube: '',
    instagram: '',
    subscribers: '',
    followers: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).every((value) => value.trim() === '');

  if (isEmpty) {
    toast.error('Please fill in at least one field before submitting.', {
      position: 'top-center',
      autoClose: 3000,
    });
    return;
  }
    console.log(formData);
    // Here you can integrate with an API
    toast.success('Collaborated successfully!', {
      position: 'top-center',
      autoClose: 2000,
      onClose: () => navigate('/'), // redirect after toast closes
    });
  };

  return (
    <div className="collab-container fade-in-up">
      <div className="collab-box">
        <div className="collab-left">
          <img src={influencerImg} alt="Influencers" className="collab-img" />
        </div>
        <div className="collab-right">
          <h1 className="collab-title">CAROAL Collaboration</h1>
          <h3 className="collab-subtitle">Details</h3>
          <form className="collab-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Influencer Name" value={formData.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="text" name="youtube" placeholder="Youtube Page name" value={formData.youtube} onChange={handleChange} />
            <input type="text" name="instagram" placeholder="Instagram Page name" value={formData.instagram} onChange={handleChange} />
    
            <select name="subscribers" value={formData.subscribers} onChange={handleChange}>
              <option value="">Subscribers</option>
              <option value="1k+">1K +</option>
              <option value="5k+">5K +</option>
              <option value="10k+">10K +</option>
              <option value="50k+">50K +</option>
              <option value="1M+">1M +</option>
            </select>
        
            <select name="followers" value={formData.followers} onChange={handleChange}>
              <option value="">Followers</option>
              <option value="1k+">1K +</option>
              <option value="5k+">5K +</option>
              <option value="10k+">10K +</option>
              <option value="50k+">50K +</option>
              <option value="1M+">1M +</option>
            </select>
            
            <button type="submit">Submit</button>
          </form>
          <p className="terms">CAROAL Terms & Conditions</p>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
