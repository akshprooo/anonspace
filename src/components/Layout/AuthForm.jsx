import { useContext, useState } from "react";
import axios from "axios";
import { userContext } from "../../context/UserProvider";

export default function AuthForm({ onSuccess }) {
    const { authMode, getUser } = useContext(userContext);
    const [password, setPassword] = useState("");
    const API = import.meta.env.VITE_API_URL;

    const mode = authMode === "login" ? "login" : "register";

    async function handleSubmit() {
        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

        try {
            const res = await axios.post(API + endpoint, { password, token:localStorage.getItem('clientToken') });

            if (res.data?.clientToken) {
                localStorage.setItem("clientToken", res.data.clientToken);
                if (onSuccess) onSuccess(res.data.clientToken);
                console.log(res)
                getUser();
                
            } else {
                alert(res.data.error || "Something went wrong");
            }
        } catch (err) {
            alert(err || "Network error");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl w-full max-w-sm">

                <h2 className="text-xl font-semibold text-center mb-4">
                    {mode === "login" ? "Login to Continue" : "Create Your Account"}
                </h2>

                <input
                    type="password"
                    className="w-full border p-2 rounded-md mb-4"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 rounded-md mb-3"
                >
                    {mode === "login" ? "Login" : "Register"}
                </button>

                <p className="text-center text-sm text-neutral-500">
                    {mode === "login"
                        ? "Enter your password to verify and continue."
                        : "Register a new account. This will generate your ClientToken."}
                </p>

            </div>
        </div>
    );
}
