import { Storefront } from "@/components/Storefront";

export async function generateMetadata({ params }: { params: Promise<{ category: string, subcategory: string }> }) {
    const resolvedParams = await params;
    const title = resolvedParams.subcategory.charAt(0).toUpperCase() + resolvedParams.subcategory.slice(1).replace("-", " ");
    return { title: `${title} | Migra Store` };
}

export default async function SubcategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ category: string; subcategory: string }>;
    searchParams: Promise<any>;
}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    return (
        <Storefront
            categorySlug={resolvedParams.category}
            subcategorySlug={resolvedParams.subcategory}
            searchParams={resolvedSearchParams}
        />
    );
}
