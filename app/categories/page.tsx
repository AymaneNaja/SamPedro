import { CategoryGrid } from '@/components/category-grid'

export default function CategoriesPage() {
    return (
        <div className="container mx-auto px-2 py-8">
            <h1 className="text-3xl font-bold mb-8">Product Categories</h1>
            <CategoryGrid />
        </div>
    )
}

