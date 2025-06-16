import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* This renders nested routes like Home, Products, etc. */}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
