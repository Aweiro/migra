import { Storefront } from "@/components/Storefront";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = await params;
    const title = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1).replace("-", " ");
    return { title: `${title} | Migra Store` };
}

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ category: string }>;
    searchParams: Promise<any>;
}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    return <Storefront categorySlug={resolvedParams.category} searchParams={resolvedSearchParams} />;
}
