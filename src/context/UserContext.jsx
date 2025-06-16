import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('coroal-user'));
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  const registerUser = (userData) => {
    localStorage.setItem('coroal-user', JSON.stringify(userData));
    setCurrentUser(userData);
    toast.success("Account created successfully!");
  };

  const loginUser = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem('coroal-user'));
    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      setCurrentUser(storedUser);
      toast.success("Login successful!");
      return true;
    }
    toast.error("Invalid email or password");
    return false;
  };

  const logoutUser = () => {
    localStorage.removeItem('coroal-user');
    setCurrentUser(null);
    toast.success("Logged out successfully!");
  };
  const updateShippingAddress = (address) => {
  const updatedUser = { ...currentUser, shippingAddress: address };
  setCurrentUser(updatedUser);
  localStorage.setItem('coroal-user', JSON.stringify(updatedUser));
  toast.success("Shipping address saved!");
};

const addOrder = (order) => {
  const updatedOrders = [...(currentUser.orders || []), order];
  const updatedUser = { ...currentUser, orders: updatedOrders };
  setCurrentUser(updatedUser);
  localStorage.setItem('coroal-user', JSON.stringify(updatedUser));
};

  return (
      <UserContext.Provider
    value={{
      currentUser,
      registerUser,
      loginUser,
      logoutUser,
      updateShippingAddress,
      addOrder,
    }}
  >
    {children}
  </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
