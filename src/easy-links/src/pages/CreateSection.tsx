import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function CreateSectionCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!title.trim() || !description.trim()) {
      setError("Preencha título e descrição antes de confirmar.");
      return;
    }

    const id = Date.now().toString();
    localStorage.setItem(`section-${id}`, JSON.stringify({ title, description }));
    navigate(`/section/${id}`);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Criar nova seção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Título da seção"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Descrição"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end mt-2">
              <Button
                onClick={handleCreate}
                variant="default"
                size="lg"
                className=" cursor-pointer bg-black text-white font-semibold px-8 py-4 rounded-lg"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
