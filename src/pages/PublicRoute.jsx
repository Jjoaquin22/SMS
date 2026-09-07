import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function PublicRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      setUser(data.user);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
}

export default PublicRoute;