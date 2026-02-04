import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useNavigate, useParams } from "react-router";
import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import { getSection, updateSection } from "@/services/sectionService";

export default function UpdateSectionPage() {
  useSignals();
  const { id } = useParams();
  const navigate = useNavigate();

  const title = useRef(signal("")).current;
  const description = useRef(signal("")).current;
  const error = useRef(signal<string | null>(null)).current;
  const loading = useRef(signal(true)).current;

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await getSection(id);
        if (!data) {
          error.value = "Seção não encontrada.";
          return;
        }

        title.value = data.title || "";
        description.value = data.description || "";
      } catch (err) {
        console.error(err);
        error.value = "Erro ao carregar a seção.";
      } finally {
        loading.value = false;
      }
    };

    load();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.value.trim() || !description.value.trim()) {
      error.value = "Preencha título e descrição antes de confirmar.";
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      await updateSection(id!, {
        title: title.value,
        description: description.value,
      });

      navigate(`/section/${id}`);
    } catch (err) {
      console.error(err);
      error.value = "Erro ao salvar alterações.";
    } finally {
      loading.value = false;
    }
  };

  if (loading.value) {
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
                value={title.value}
                onChange={(e) => (title.value = e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description.value}
                onChange={(e) => (description.value = e.target.value)}
                className="mt-2"
              />
            </div>

            {error.value && (
              <p className="text-red-600 text-sm">{error.value}</p>
            )}

            <div className="flex justify-end mt-2">
              <Button
                onClick={handleUpdate}
                disabled={loading.value}
                className="cursor-pointer bg-black text-white font-semibold px-8 py-4 rounded-lg disabled:opacity-60"
              >
                {loading.value ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>

            <div className="mt-4 p-3 text-xs bg-slate-100 rounded">
              <p className="font-bold">Signals ao vivo</p>
              <p>title → {title.value}</p>
              <p>description → {description.value}</p>
              <p>loading → {String(loading.value)}</p>
              <p>error → {error.value ?? "null"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}