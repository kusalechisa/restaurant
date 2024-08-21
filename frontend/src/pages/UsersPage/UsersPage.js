import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAll, toggleBlock } from "../../services/userService";
import classes from "./usersPage.module.css";
import Title from "../../components/Title/Title";
import Search from "../../components/Search/Search";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchTerm } = useParams();
  const auth = useAuth();

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await getAll(searchTerm);
      setUsers(users);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const isBlocked = await toggleBlock(userId);
      setUsers((oldUsers) =>
        oldUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked } : user
        )
      );
    } catch (err) {
      setError("Failed to toggle block status.");
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <Title title="Manage Users" />
        <Search
          searchRoute="/admin/users/"
          defaultRoute="/admin/users"
          placeholder="Search Users"
          margin="1rem 0"
        />

        {loading && <p>Loading...</p>}
        {error && <p className={classes.error}>{error}</p>}

        {!loading && !error && (
          <>
            <div className={classes.list_item}>
              <h3>Name</h3>
              <h3>Email</h3>
              <h3>Address</h3>
              <h3>Admin</h3>
              <h3>Actions</h3>
            </div>
            {users.length === 0 && <p>No users found.</p>}
            {users.map((user) => (
              <div key={user.id} className={classes.list_item}>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{user.address}</span>
                <span>{user.isAdmin ? "✅" : "❌"}</span>
                <span className={classes.actions}>
                  <Link to={`/admin/editUser/${user.id}`}>Edit</Link>
                  {auth.user.id !== user.id && (
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleBlock(user.id);
                      }}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </Link>
                  )}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
