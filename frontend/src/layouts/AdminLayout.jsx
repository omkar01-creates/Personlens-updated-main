import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const initial = user && user.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="layout">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)}></div>}
      <div className="main">
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="hamburger" onClick={() => setOpen(true)} data-testid="admin-menu-btn">
              <Menu size={24} />
            </button>
            <h2>Admin Panel</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{user && user.name}</div>
              <div className="sub">Administrator</div>
            </div>
            <div className="avatar">{initial}</div>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
