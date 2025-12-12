import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BellIcon } from "lucide-react";
import type { NotificationMessage } from "@/services/useNotifications";

type Props = { notifications: NotificationMessage[] };

export function NotificationsBell({ notifications }: Props) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 4;

  const totalPages = Math.ceil(notifications.length / pageSize);
  const currentNotifications = notifications.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative min-w-[40px] min-h-[40px] p-2 sm:min-w-[48px] sm:min-h-[48px] sm:p-3 rounded-full flex items-center justify-center">
          <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 sm:w-96 bg-gray-900 rounded-xl"  align="end" sideOffset={4}>
        <h4 className="font-bold mb-2 text-white">Notificações</h4>

        {currentNotifications.length === 0 && <p className="text-white">Sem notificações</p>}

        {currentNotifications.map((n, idx) => (
          <div
            key={idx}
            className="p-3 border-b last:border-b-0 text-sm bg-gray-900 text-white rounded-md"
          >
            <p className="font-semibold">
              {n.type.toUpperCase()} — na linha {n.newRowData?.name ?? "-"} da seção {n.sectionName}
            </p>
            {n.type == "update" && n.oldRowData && n.newRowData && (
              <div className="mt-1 text-xs">
                <p className="font-medium">Campo alterado: {n.changedField}</p>
                <div className="mt-1">
                  <p className="text-red-600">
                    <span className="font-semibold">Antigo:</span>{" "}
                    {String(n.oldRowData[n.changedField])}
                  </p>
                  <p className="text-green-600">
                    <span className="font-semibold">Novo:</span>{" "}
                    {String(n.newRowData[n.changedField])}
                  </p>
                </div>
              </div>
            )}

            <p className="text-[10px] text-gray-500 mt-2">
              {new Date(n.timestamp).toLocaleString()}
            </p>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex justify-between mt-2">
            <Button
              size="sm"
              className="bg-gray-800 text-white"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
            >
              {"<"} Anterior
            </Button>

            <span className="text-xs text-gray-400">
              {page + 1} / {totalPages}
            </span>

            <Button
              size="sm"
              disabled={page === totalPages - 1}
              className="bg-gray-800 text-white"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            >
              Próximo {">"}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
