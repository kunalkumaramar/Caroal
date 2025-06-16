import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import PromoStrip from "../components/PromoStrip";
import DealsOfMonth from "../components/DealsOfMonth";
import NewArrivals from "../components/NewArrivals";
import SpecialProduct from "../components/SpecialProduct";
import InstagramSection from "../components/InstagramSection";
import TestimonialSection from "../components/TestimonialSection";
import LearnAbout from "../components/LearnAbout";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <HeroSection />
      <PromoStrip />

      <div id="deals-section">
        <DealsOfMonth />
      </div>

      <div id="newarrivals">
        <NewArrivals />
      </div>

      <SpecialProduct />
      <InstagramSection />
      <TestimonialSection />
      <LearnAbout />
    </>
  );
};

export default Home;
