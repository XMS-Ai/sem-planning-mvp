import ClientPage from "./client-page";

export function generateStaticParams() {
  return [{ id: "demo" }];
}

export default function Page() {
  return <ClientPage />;
}
