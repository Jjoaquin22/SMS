import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { supabase } from "../supabaseClient";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        navigate("/Dashboard", { replace: true });
      }
    } catch {
      setErrorMessage("Unable to log in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-intro">
        <p className="brand-mark">NIGGASTAR <span>/ SMS</span></p>
        <div className="intro-copy">
          <p className="eyebrow">Student management, clarified</p>
          <h1>Keep every student in view.</h1>
          <p>One calm workspace for the people, details, and daily decisions that keep your school moving.</p>
        </div>
        <p className="intro-footer">Built for focused school teams</p>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="muted">Use your administrator account to continue.</p>
          <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {errorMessage && <p role="alert">{errorMessage}</p>}
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        <p className="form-footer">New to Niggastar? <Link to="/Register">Create an account</Link></p>
      </form>
        </div>
      </section>
    </main>
  )
}

export default Login