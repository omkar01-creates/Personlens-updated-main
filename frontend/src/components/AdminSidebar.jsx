import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Eye,
} from "lucide-react";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: FileText },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className={"admin-sidebar" + (open ? " open" : "")} data-testid="admin-sidebar">
      <div className="sidebar-logo">
        <Eye size={24} /> PersonLens
      </div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onClose}
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
          data-testid={"admin-nav-" + link.label.toLowerCase()}
        >
          <link.icon size={19} /> {link.label}
        </NavLink>
      ))}
      <div className="nav-spacer"></div>
      <button className="nav-item" onClick={handleLogout} data-testid="admin-logout-btn">
        <LogOut size={19} /> Logout
      </button>
    </div>
  );
}

export default AdminSidebar;
