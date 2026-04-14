import { Storefront } from "@/components/Storefront";

export const metadata = {
  title: "Migra | Fresh picks for your next move",
  description: "Modern e-commerce platform",
};

export default async function HomePage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return <Storefront searchParams={resolvedSearchParams} />;
}