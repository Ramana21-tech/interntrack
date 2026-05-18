import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold tracking-wide">
        🏢 InternTrack
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User size={18} />
          <span className="text-sm font-medium">{currentUser?.name}</span>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
            {currentUser?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;