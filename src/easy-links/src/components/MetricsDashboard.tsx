import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  Link as LinkIcon,
  Tags,
  MousePointerClick,
  Clock,
} from "lucide-react";

type Metrics = {
  totalLinks: number;
  totalTags: number;
  totalUsers: number;
  totalAccesses: number;
  timestamp?: number;
};

export function MetricsDashboard() {
  const { id: sectionId } = useParams<{ id: string }>();
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    if (!sectionId) return;

    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/metrics/${sectionId}`
        );

        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error("Erro ao carregar métricas", err);
      }
    };

    load();

    const interval = setInterval(load, 3000);

    return () => clearInterval(interval);
  }, [sectionId]);

  if (!metrics) return null;

  return (
    <section className="p-5 max-w-4xl mx-auto bg-slate-100/70 rounded-md mb-8">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
        <MetricInline
          icon={<LinkIcon className="h-4 w-4" />}
          label="Links"
          value={metrics.totalLinks}
        />

        <MetricInline
          icon={<Tags className="h-4 w-4" />}
          label="Tags"
          value={metrics.totalTags}
        />

        <MetricInline
          icon={<Users className="h-4 w-4" />}
          label="Usuários"
          value={metrics.totalUsers}
        />

        <MetricInline
          icon={<MousePointerClick className="h-4 w-4" />}
          label="Acessos"
          value={metrics.totalAccesses}
        />
      </div>

      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
        <Clock className="h-3 w-3" />
        <span>
          Atualizado às{" "}
          {metrics.timestamp
            ? new Date(metrics.timestamp).toLocaleTimeString()
            : "-"}
        </span>
      </div>
    </section>
  );
}

function MetricInline({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-400">{icon}</span>
      <span className="font-medium text-gray-800">
        {value ?? 0}
      </span>
      <span className="text-gray-500">
        {label}
      </span>
    </div>
  );
}