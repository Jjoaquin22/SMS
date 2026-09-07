import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(null);
  const [studentCountError, setStudentCountError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (isMounted) {
        setUser(data.user);
        setLoading(false);
      }
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null);
        }
      },
    );

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadStudentCount = async () => {
      const { count, error } = await supabase
        .from("profile")
        .select("id", { count: "exact", head: true });

      if (error) {
        setStudentCountError(error.message);
      } else {
        setStudentCount(count ?? 0);
      }
    };

    loadStudentCount();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand-mark" to="/Dashboard">NORTHSTAR <span>/ SMS</span></Link>
        <div className="topbar-actions">
          <span className="user-chip">{user.email}</span>
          <button className="button button-quiet" type="button" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      <main className="page-content dashboard-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Good to see you.</h1>
            <p className="muted">A quick read on your student records.</p>
          </div>
          <Link className="button button-primary" to="/ManageStudents">Manage students <span aria-hidden="true">-&gt;</span></Link>
        </div>
        <section className="stats-grid" aria-label="Student statistics">
          <article className="stat-card stat-card-accent">
            <p className="stat-label">Total students</p>
            <p className="stat-number">{studentCount === null ? "-" : studentCount}</p>
            <p className="stat-note">Profiles in your directory</p>
          </article>
          <article className="info-card">
            <p className="eyebrow">Directory</p>
            <h2>Keep records current.</h2>
            <p className="muted">Add a new profile or make a quick correction from the student directory.</p>
            <Link className="text-link" to="/ManageStudents">Open directory <span aria-hidden="true">-&gt;</span></Link>
          </article>
        </section>
        {studentCountError && <p className="alert" role="alert">{studentCountError}</p>}
      </main>
    </div>
  );
}

export default Dashboard;