import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BellIcon } from "lucide-react";
import type { NotificationMessage } from "@/services/useNotifications";

type Props = { notifications: NotificationMessage[] };

export function NotificationsBell({ notifications }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <BellIcon />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-3 mr-6 bg-gray-900">
        <h4 className="font-bold mb-2 text-white">Notificações</h4>

        {notifications.length === 0 && (
          <p className="text-white">Sem notificações</p>
        )}

        {notifications.map((n, idx) => (
          <div key={idx} className="p-3 border-b last:border-b-0 text-sm bg-gray-900 text-white rounded-md">
            <p className="font-semibold">
              {n.type.toUpperCase()} — Linha {n.rowIndex ?? "-"} da seção {n.sectionId}
            </p>

            {n.type !== "create" && n.oldRowData && n.newRowData && (
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
              {new Date(n.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
