import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import axios from "axios";

const apiUrl = 'http://localhost:3000';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [backendError, setBackendError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBackendError(null);

    try {
      const res = await axios.post(`${apiUrl}/login`, {
        email: username,      
        password,
      });

      if (!res.data.success) {
        setBackendError("Credenciais inválidas");
        return;
      }

      // salva JWT no contexto
      login(res.data.token, username);

      navigate("/enquetes");
    } catch (err: any) {
      console.error("LOGIN ERROR ", err);

      if (axios.isAxiosError(err)) {
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
      }

      setBackendError("Erro ao conectar com o servidor");
    }
  }


  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 px-4">

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Easy Links</h1>
        <p className="text-sm text-gray-600 mt-1">
          Bem vindo de volta!
        </p>
      </div>

      <Card className="w-[350px] shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleLogin}>
            <Input
              placeholder="Seu e-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {backendError && (
              <p className="text-red-600 text-sm">{backendError}</p>
            )}

            <Button className="w-full" type="submit">
              Entrar
            </Button>

            <a
              href="/register"
              className="block text-center text-sm text-blue-600 mt-2 hover:underline"
            >
              Criar conta
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}