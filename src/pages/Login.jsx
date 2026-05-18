import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    const result = login(email, password);
    if (result.success) {
      if (result.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">🏢 InternTrack</h1>
          <p className="text-gray-500 mt-2">Company Intern Management System</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2">
            <Mail size={18} className="text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
        >
          <LogIn size={18} />
          Login
        </button>

        <div className="mt-6 text-xs text-gray-400 text-center">
          <p>Admin: admin@company.com / admin123</p>
          <p>Intern: rams@intern.com / intern123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;