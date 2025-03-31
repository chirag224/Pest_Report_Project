const InputField = ({ label, type, name, value, onChange, placeholder }) => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
    );
  };
  
  export default InputField;
  