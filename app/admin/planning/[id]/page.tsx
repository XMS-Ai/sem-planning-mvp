import ClientPage from "./client-page";
import { seededSessions } from "@/mock-data/planning";

export function generateStaticParams() {
  const sessionIds = seededSessions.map((s) => ({ id: s.id }));
  return [{ id: "demo" }, ...sessionIds];
}

export default function Page() {
  return <ClientPage />;
}
