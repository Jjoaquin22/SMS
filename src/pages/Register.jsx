import Back from "../components/Back";
import { useState } from "react";
import { supabase } from "../supabaseClient";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.log(error.message);
            return;
        }

        console.log(data);
        alert("Registration successful!");
    }
    return (
        <>    
            <h2>Register</h2>
            <Back />
           <form onSubmit={handleSubmit}>
                <input name="email" type="email" />
                <input name="password" type="password" />

                <button type="submit">
                    Register
                </button>
            </form>
        </>
    )
}
export default Register