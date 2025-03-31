import { Link } from "react-router-dom";
import Button from "../components/Button"; 

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to Pest Report System
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          A simple and efficient way to manage pest control reports.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/login">
            <Button text="User Login" color="blue" />
          </Link>
          <Link to="/signup">
            <Button text="User Signup" color="green" />
          </Link>
          <Link to="/admin/login">
            <Button text="Admin Login" color="red" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
