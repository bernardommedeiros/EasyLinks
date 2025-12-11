// components/NotificationsBell.tsx
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
      <PopoverContent className="w-80">
        <h4 className="font-bold mb-2">Notificações</h4>
        {notifications.length === 0 && <p className="text-gray-500">Sem notificações</p>}
        {notifications.map((n, idx) => (
          <div key={idx} className="p-2 border-b last:border-b-0">
            <p className="text-sm">
              {n.type.toUpperCase()} - Linha {n.rowIndex ?? "-"} da seção {n.sectionId}
            </p>
            <p className="text-xs text-gray-500">{new Date(n.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
