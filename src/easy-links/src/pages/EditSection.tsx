import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import { getSection, updateSection } from "@/services/sectionService";

export default function UpdateSectionPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const data = await getSection(id);
      if (!data) {
        setError("Seção não encontrada.");
        setLoading(false);
        return;
      }

      setTitle(data.title || "");
      setDescription(data.description || "");
      setLoading(false);
    };

    load();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Preencha título e descrição antes de confirmar.");
      return;
    }

    await updateSection(id!, { title, description });
    navigate(`/section/${id}`);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Editar seção</CardTitle>
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
                onClick={handleUpdate}
                variant="default"
                size="lg"
                className="cursor-pointer bg-black text-white font-semibold px-8 py-4 rounded-lg"
              >
                Salvar alterações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
