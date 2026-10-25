import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import API from "../../services/api";
import EmptyState from "../../components/EmptyState";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  async function getUsers(searchValue = "") {
    try {
      const res = await API.get("/admin/users", { params: { search: searchValue } });
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function deleteUser(id, e) {
    e.stopPropagation();
    if (!window.confirm("Delete this user and all their data?")) return;
    try {
      await API.delete("/admin/users/" + id);
      toast.success("User deleted");
      getUsers(search);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete user");
    }
  }

  return (
    <div className="fade-in">
      <div className="mb-20">
        <h2>Users</h2>
        <p className="muted">Manage all registered users.</p>
      </div>

      <div className="card">
        <div className="field" style={{ position: "relative", marginBottom: 20 }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: 13, color: "var(--muted)" }} />
          <input
            style={{ paddingLeft: 42 }}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); getUsers(e.target.value); }}
            data-testid="user-search"
          />
        </div>

        {loading ? (
          <div className="spinner" style={{ margin: "20px auto" }}></div>
        ) : users.length === 0 ? (
          <EmptyState title="No users found" text="No users match your search." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ cursor: "pointer" }} onClick={() => navigate("/admin/users/" + u._id)} data-testid="admin-user-row">
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="tag">{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.role !== "ADMIN" && (
                        <button className="btn btn-danger btn-sm" onClick={(e) => deleteUser(u._id, e)} data-testid="delete-user-btn">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
