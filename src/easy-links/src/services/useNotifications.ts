import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export type NotificationMessage = {
  sectionId: string;
  sectionName: string;
  rowIndex: number | null;
  type: "update" | "delete" | "add";
  timestamp: number;

  oldRowData?: Record<string, any> | null;
  newRowData?: Record<string, any> | null;
  changedField?: string | null;
};



export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [alert, setAlert] = useState<NotificationMessage | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      const snap = await getDocs(collection(db, "notifications"));
      const data = snap.docs.map((d) => d.data() as NotificationMessage);

      setNotifications(data.sort((a, b) => b.timestamp - a.timestamp));
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket("ws://localhost:8080");
      wsRef.current = ws;

      console.log("Conectando ao WebSocket…");

      ws.onopen = () => {
        console.log("WS conectado!");
      };

      ws.onmessage = (event) => {
        const data: NotificationMessage = JSON.parse(event.data);

        setNotifications((prev) => [data, ...prev]);
        setAlert(data);

        setTimeout(() => setAlert(null), 3000);
      };

      ws.onclose = () => {
        console.warn("WS desconectado. Tentando reconectar em 2s…");
        setTimeout(connect, 2000); // reconecta automaticamente
      };

      ws.onerror = (err) => {
        console.error("WS ERROR:", err);
        ws.close();
      };
    }

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { notifications, alert };
}
