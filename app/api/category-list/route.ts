import { NextResponse } from 'next/server';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com/products/category-list';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com/search/photos';
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export async function GET() {
    try {
        // Fetch categories from DummyJSON
        const categoryResponse = await fetch(DUMMYJSON_BASE_URL);
        const categories = await categoryResponse.json();

        // Fetch images for each category from Unsplash
        const categoryData = await Promise.all(
            categories.map(async (category: string) => {
                try {
                    const unsplashResponse = await fetch(
                        `${UNSPLASH_BASE_URL}?query=${encodeURIComponent(
                            category
                        )}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
                    );
                    const unsplashData = await unsplashResponse.json();

                    const imageUrl =
                        unsplashData.results.length > 0
                            ? unsplashData.results[0].urls.regular
                            : null;

                    return {
                        name: category,
                        image: imageUrl,
                    };
                } catch {
                    // If Unsplash fails, return category with no image
                    return {
                        name: category,
                        image: null,
                    };
                }
            })
        );

        return NextResponse.json(categoryData);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to fetch categories or images.' },
            { status: 500 }
        );
    }
}
