// hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export type NotificationMessage = {
  sectionId: string;
  rowIndex?: number | null;
  type: "add" | "update" | "delete";
  rowData?: any | null;
  timestamp: number;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [alert, setAlert] = useState<NotificationMessage | null>(null);

  // 1️⃣ Buscar histórico do Firestore
  useEffect(() => {
    async function fetchHistory() {
      const snap = await getDocs(collection(db, "notifications"));
      const data = snap.docs.map((d) => d.data() as NotificationMessage);
      setNotifications(data.sort((a, b) => b.timestamp - a.timestamp));
    }
    fetchHistory();
  }, []);

  // 2️⃣ WebSocket para novas notificações
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const data: NotificationMessage = JSON.parse(event.data);
      setNotifications((prev) => [data, ...prev]);
      setAlert(data);

      setTimeout(() => setAlert(null), 3000);
    };

    return () => ws.close();
  }, []);

  return { notifications, alert };
}
