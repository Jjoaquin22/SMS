import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleRegister(e) {
        e.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setErrorMessage(error.message);
        }

        setIsSubmitting(false);
    }
    return (
        <main className="auth-layout">
            <section className="auth-intro">
                <p className="brand-mark">NIGGASTAR <span>/ SMS</span></p>
                <div className="intro-copy">
                    <p className="eyebrow">A clearer starting point</p>
                    <h1>Make room for better work.</h1>
                    <p>Set up your school workspace and bring student records into one dependable home.</p>
                </div>
                <p className="intro-footer">Built for focused school teams</p>
            </section>
            <section className="auth-panel">
                <div className="auth-card">
                    <p className="eyebrow">Get started</p>
                    <h2>Create your workspace</h2>
                    <p className="muted">Choose an email and password for your administrator account.</p>
                    <form onSubmit={handleRegister}>
                <label htmlFor="register-email">Email address</label>
                <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="register-password">Password</label>
                <input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                />
                {errorMessage && <p role="alert">{errorMessage}</p>}

                <button className="button button-primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
                <p className="form-footer">Already have an account? <Link to="/">Sign in</Link></p>
                    </form>
                </div>
            </section>
        </main>
    )
}
export default Register