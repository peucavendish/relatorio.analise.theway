import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Login = () => {
    const { isAuthenticated, authenticate } = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/relatorio");
        }
    }, [isAuthenticated, navigate]);

    async function handleLogin(event) {
        event.preventDefault();
        setErrorMessage("");

        const { email, password } = event.target.elements;

        try {
            await authenticate(email.value, password.value);
            navigate("/");
        } catch (error) {
            setErrorMessage("Credenciais inválidas. Por favor, verifique seu email e senha.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border">
                <div>
                    <div className="flex justify-center mb-6">
                        <img
                            className="h-25 w-auto object-contain"
                            src="/logo-light.png"
                            alt="Logo da empresa"
                        />
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-bold text-card-foreground">
                        Bem-vindo
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Faça login para acessar sua conta
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Seu email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-1">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Sua senha"
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out transform hover:scale-[1.02]"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
