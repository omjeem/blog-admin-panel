import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { BACKEND_URL } from "../utils";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });

    const router = useNavigate();

    const validate = () => {
        let newErrors: any = {};
        if (!email.trim()) newErrors.email = "Email is required.";
        if (!password.trim()) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            router("/admin")
        }
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const isValidated = validate();
        if (!isValidated) return;
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/signin`, {
                email,
                password
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const token = response.data.token
            localStorage.setItem("token", token)
            toast.success("Logged in successfully")
            router("/admin")
        } catch (err: any) {
            const message = err?.response?.data?.error
            if (message) {
                toast.error(message)
            } else {
                toast.error("Error while logging in")
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Toaster />
            <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                <div className="flex justify-center mb-4">
                    <img src={"https://ik.imagekit.io/omjeem007/astrix_live_logo.jpeg"} alt="Logo" height={100} width={100} />
                </div>
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    Admin-Login
                </h2>
                <div className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            className={twMerge(
                                "w-full px-3 py-2 border rounded-md focus:outline-none",
                                errors.email ? "border-red-500" : "border-gray-300"
                            )}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={twMerge(
                                    "w-full px-3 py-2 border rounded-md focus:outline-none",
                                    errors.password ? "border-red-500" : "border-gray-300"
                                )}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}