const Button = ({ text, onClick, type = "button", color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500 hover:bg-blue-600",
      green: "bg-green-500 hover:bg-green-600",
      red: "bg-red-500 hover:bg-red-600",
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        className={`w-full text-white px-6 py-3 rounded-lg shadow-md transition duration-200 ${colorClasses[color]}`}
      >
        {text}
      </button>
    );
  };
  
  export default Button;
  