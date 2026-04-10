import ClientPage from "./client-page";
import { seededClients } from "@/mock-data/clients";

export function generateStaticParams() {
  const clientSlugs = seededClients.map((c) => ({ slug: c.slug }));
  return [{ slug: "demo" }, ...clientSlugs];
}

export default function Page() {
  return <ClientPage />;
}
