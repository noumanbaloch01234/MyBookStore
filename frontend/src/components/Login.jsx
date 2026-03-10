import React, { useState } from 'react';
import { useStore } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { showLogin, setShowLogin, setUser, registerUser, loginUser } = useStore();
    const [state, setState] = useState("login");
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (state === "login") {
            const success = await loginUser(formData.email, formData.password);
            if (!success) {
                setError('Invalid email or password');
                return;
            }
        } else {
            const success = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            if (!success) {
                setError('Registration failed. Email may already exist.');
                return;
            }
        }

        setShowLogin(false);
        setFormData({ name: '', email: '', password: '' });
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!showLogin) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
            <div className="absolute inset-0" onClick={() => setShowLogin(false)}></div>

            <form
                onSubmit={handleSubmit}
                className="relative w-full sm:w-96 text-center border border-gray-300/60 rounded-2xl px-8 bg-white z-10"
            >
                <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h1 className="text-gray-900 text-3xl mt-10 font-medium">
                    {state === "login" ? "Login" : "Sign up"}
                </h1>
                <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>

                {state !== "login" && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="mt-6 w-full h-12 border rounded-full px-4 outline-none"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email id"
                    className="mt-4 w-full h-12 border rounded-full px-4 outline-none"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="mt-4 w-full h-12 border rounded-full px-4 outline-none"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button type="submit" className="mt-4 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90">
                    {state === "login" ? "Login" : "Sign up"}
                </button>

                <p className="text-gray-500 text-sm mt-3 mb-11">
                    {state === "login" ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                        type="button"
                        onClick={() => setState(prev => prev === "login" ? "register" : "login")}
                        className="text-indigo-500 hover:underline"
                    >
                        {state === "login" ? "Sign up" : "Login"}
                    </button>
                </p>
            </form>
        </div>
    );
}