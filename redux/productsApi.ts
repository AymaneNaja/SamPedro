import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Cart", "Favorites"],
    endpoints: (builder) => ({
        fetchProducts: builder.query({
            query: () => "/products",
            keepUnusedDataFor: 300, // Keep unused data in the cache for 5 minutes
        }),
        searchProducts: builder.query({
            query: (query) => `/search?q=${query}`,
        }),
        fetchSingleProduct: builder.query({
            query: (id) => `/product/${id}`,
            keepUnusedDataFor: 300,
        }),
        fetchCategories: builder.query({
            query: () => "/category-list",
            keepUnusedDataFor: 600, // Keep categories in cache for 10 minutes
        }),
        fetchCategory: builder.query({
            query: (category) => `/category/${category}`,
        }),
        getCart: builder.query({
            query: () => "cart",
            providesTags: ["Cart"],
        }),
        addToCart: builder.mutation({
            query: ({ productId, quantity, price }) => ({
                url: "cart",
                method: "POST",
                body: JSON.stringify({ productId, quantity, price }),
            }),
            invalidatesTags: ["Cart"],
        }),
        updateCart: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: "cart",
                method: "PUT",
                body: { id, ...patch },
            }),
            invalidatesTags: ["Cart"],
        }),
        removeFromCart: builder.mutation({
            query: ({ id }) => ({
                url: `cart?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
        getFavorites: builder.query({
            query: () => "favorite",
            providesTags: ["Favorites"],
        }),
        addToFavorites: builder.mutation({
            query: (productId) => ({
                url: "favorite",
                method: "POST",
                body: JSON.stringify({ productId }),
            }),
            invalidatesTags: ["Favorites"],
        }),
        removeFromFavorites: builder.mutation({
            query: ({ id }) => ({
                url: `favorite?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Favorites"],
        }),
    }),
})

export const {
    useSearchProductsQuery,
    useFetchProductsQuery,
    useFetchCategoriesQuery,
    useFetchSingleProductQuery,
    useFetchCategoryQuery,
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartMutation,
    useRemoveFromCartMutation,
    useGetFavoritesQuery,
    useAddToFavoritesMutation,
    useRemoveFromFavoritesMutation,
} = productsApi

