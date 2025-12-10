import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { listSections, removeSection } from "@/services/sectionService";

type SectionInfo = {
  id: string;
  title: string;
  description: string;
};

export default function Home() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await listSections();
      setSections(data as SectionInfo[]);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    await removeSection(id);
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading)
    return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Seções</h1>
      </div>

      {sections.length === 0 ? (
        <p>Nenhuma seção criada ainda.</p>
      ) : (
        <ul className="space-y-3">
          {sections.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/section/${s.id}`)}
              >
                <h2 className="font-semibold">{s.title}</h2>
                <p className="text-sm text-gray-600">{s.description}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/section/${s.id}/edit`)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="border-color-red hover:bg-red-100 border border-red-500 text-red-600"
                  onClick={() => handleDelete(s.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/create")}
        className="cursor-pointer mt-5"
      >
        <Plus /> Criar seção
      </Button>
    </div>
  );
}
