import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { googleLogin } from "../redux/authSlice";

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    console.log("OAuth Code:", code); // ✅ Log the code to debug

    if (code) {
      dispatch(googleLogin(code))
        .unwrap()
        .then(() => {
          console.log("Google login successful");
          navigate("/", { replace: true }); // ✅ Redirect to home and remove ?code= from URL
        })
        .catch((error) => {
          console.error("Google login failed:", error); // ✅ Log the error
          navigate("/signin"); // Fallback in case of failure
        });
    } else {
      console.warn("No OAuth code found");
      navigate("/signin");
    }
  }, [dispatch, location.search, navigate]);

  return <p style={{ textAlign: "center", marginTop: "50px" }}>Signing you in with Google...</p>;
};

export default GoogleCallback;
