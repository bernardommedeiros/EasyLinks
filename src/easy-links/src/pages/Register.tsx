import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [backendError, setBackendError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);
    setSuccess(false);

    const res = await axios.post(`${apiUrl}/auth/register`, {
      username,
      password,
    });

    if (res.status !== 201) {
      setBackendError("Credenciais inválidas");
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 px-4">

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Easy Links</h1>
        <p className="text-sm text-gray-600 mt-1">
          Organize seus links mais importantes!
        </p>
      </div>

      <Card className="w-[350px] shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Criar Conta</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-3" onSubmit={handleRegister}>
            <Input
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {backendError && (
              <p className="text-red-600 text-sm">{backendError}</p>
            )}

            {success && (
              <p className="text-green-600 text-sm">
                Conta criada! Vá para o login.
              </p>
            )}

            <Button className="w-full" type="submit">
              Registrar
            </Button>

            <a
              href="/"
              className="block text-center text-sm text-blue-600 mt-2 hover:underline"
            >
              Já possui conta? Entrar
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}