import ProductPage from '@/components/product/ProductPage'
import React from 'react'


function page({ params }: { params: { id: string } }) {
  return (
    <ProductPage id={params.id} />
  )
}

export default page