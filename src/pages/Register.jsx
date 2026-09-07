import Back from "../components/Back";
import { useState } from "react";
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
        <>    
            <h2>Register</h2>
            <Back />
           <form onSubmit={handleRegister}>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
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

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
            </form>
        </>
    )
}
export default Register