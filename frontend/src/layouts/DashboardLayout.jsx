
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const titles = {
  "/dashboard": "Dashboard",
  "/personality-test": "Personality Test",
  "/voice-analyzer": "Voice Analyzer",
  "/reports": "Reports",
  "/history": "History",
  "/profile": "Profile",
  "/settings": "Settings",
};

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const location = useLocation();
  const { user } = useAuth();

  let title = "Dashboard";

  Object.keys(titles).forEach((key) => {
    if (location.pathname.startsWith(key)) {
      title = titles[key];
    }
  });

  const initial =
    user && user.name ? user.name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get("/notifications");
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = async (notificationId) => {
    try {
      await API.patch(`/notifications/${notificationId}/read`);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {open && (
        <div
          className="sidebar-backdrop"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <div className="main">
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              className="hamburger"
              onClick={() => setOpen(true)}
              data-testid="menu-btn"
            >
              <Menu size={24} />
            </button>

            <h2>{title}</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Notification bell */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowNotifications((previous) => !previous)}
                aria-label="Notifications"
                style={{
                  position: "relative",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                <Bell size={22} />

                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      minWidth: 17,
                      height: 17,
                      padding: "0 4px",
                      borderRadius: 20,
                      background: "#e53935",
                      color: "#fff",
                      fontSize: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: 300,
                    maxWidth: "85vw",
                    maxHeight: 350,
                    overflowY: "auto",
                    background: "#fff",
                    color: "#222",
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      padding: "12px 14px",
                      fontWeight: 700,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    Notifications ({unreadCount} unread)
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ padding: 16, fontSize: 14 }}>
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        type="button"
                        key={notification._id}
                        onClick={() => {
                          if (!notification.read) {
                            markAsRead(notification._id);
                          }
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: 12,
                          border: "none",
                          borderBottom: "1px solid #eee",
                          cursor: notification.read ? "default" : "pointer",
                          background: notification.read ? "#fff" : "#f0f6ff",
                          color: "#222",
                        }}
                      >
                        <div style={{ fontSize: 14 }}>
                          {notification.message}
                        </div>

                        <div
                          style={{
                            fontSize: 11,
                            color: "#777",
                            marginTop: 5,
                          }}
                        >
                          {notification.createdAt
                            ? new Date(notification.createdAt).toLocaleString()
                            : ""}
                          {!notification.read && " • New"}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {user && user.name}
              </div>

              <div className="sub">{user && user.email}</div>
            </div>

            <div className="avatar" data-testid="topbar-avatar">
              {user && user.profileImage ? (
                <img src={user.profileImage} alt="" />
              ) : (
                initial
              )}
            </div>
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
