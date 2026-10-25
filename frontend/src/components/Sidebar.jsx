import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Brain,
  Mic,
  FileText,
  History,
  User,
  Settings,
  LogOut,
  Eye,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/personality-test", label: "Personality Test", icon: Brain },
  { to: "/voice-analyzer", label: "Voice Analyzer", icon: Mic },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className={"sidebar" + (open ? " open" : "")} data-testid="sidebar">
      <div className="sidebar-logo">
        <Eye size={24} /> PersonLens
      </div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onClose}
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
          data-testid={"nav-" + link.label.toLowerCase().replace(/ /g, "-")}
        >
          <link.icon size={19} /> {link.label}
        </NavLink>
      ))}
      <div className="nav-spacer"></div>
      <button className="nav-item" onClick={handleLogout} data-testid="logout-btn">
        <LogOut size={19} /> Logout
      </button>
    </div>
  );
}

export default Sidebar;
