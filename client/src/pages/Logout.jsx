import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the authentication data (e.g., JWT token) from localStorage/sessionStorage or context
    localStorage.removeItem("authToken"); // Example for localStorage
    sessionStorage.removeItem("authToken"); // Example for sessionStorage
    // If you're using context for global auth state, you can reset that as well

    // Redirect user to the login page after successful logout
    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-2xl font-semibold text-gray-700">
        Logging you out...
      </h2>
    </div>
  );
};

export default Logout;
