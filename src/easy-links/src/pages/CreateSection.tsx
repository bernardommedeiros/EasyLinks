import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useNavigate } from "react-router";
import { useRef } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import { createSection } from "@/services/sectionService";

export default function CreateSectionCard() {
  useSignals();
  const navigate = useNavigate();

  const title = useRef(signal("")).current;
  const description = useRef(signal("")).current;
  const error = useRef(signal<string | null>(null)).current;
  const loading = useRef(signal(false)).current;

  const handleCreate = async () => {
    if (!title.value.trim() || !description.value.trim()) {
      error.value = "Preencha título e descrição antes de confirmar.";
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      const newDocRef = await createSection({
        title: title.value,
        description: description.value,
      });

      navigate(`/section/${newDocRef.id}`);
    } catch (err) {
      console.error(err);
      error.value = "Erro ao criar a seção. Tente novamente.";
    } finally {
      loading.value = false;
    }
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
                value={title.value}
                onChange={(e) => (title.value = e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description.value}
                onChange={(e) => (description.value = e.target.value)}
              />
            </div>

            {error.value && (
              <p className="text-red-600 text-sm">{error.value}</p>
            )}

            <Button
              onClick={handleCreate}
              disabled={loading.value}
              className="w-full bg-black text-white disabled:opacity-60"
            >
              {loading.value ? "Criando..." : "Confirmar"}
            </Button>

            <div className="mt-4 p-3 text-xs bg-slate-100 rounded">
              <p className="font-bold">Signals ao vivo</p>
              <p>title → {title.value}</p>
              <p>description → {description.value}</p>
              <p>loading → {String(loading.value)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
