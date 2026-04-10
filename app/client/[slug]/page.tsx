import ClientPage from "./client-page";

export function generateStaticParams() {
  return [{ slug: "demo" }];
}

export default function Page() {
  return <ClientPage />;
}
