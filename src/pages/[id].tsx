import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { productsInterface } from './index';

export default function ProductInfo() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<productsInterface>();

  useEffect(() => {
    if (id) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then((json) => setProduct(json));
    }
  }, [id]);

  return (
    <>
      <Link href="/">
        <p className="absolute left-56 top-8 cursor-pointer text-7xl">👋</p>
      </Link>
      {product && (
        <main className="flex h-screen w-full flex-col items-center justify-center pt-10">
          <div className="h-80 w-60">
            <Image
              src={product.image}
              alt="product image"
              height="550px"
              width="500px"
            />
          </div>

          <div className="h-80 w-1/2 [&>*]:p-4">
            <b>{product.title}</b>
            <p>{product.description}</p>
            <div className="flex w-full justify-between">
              <p>${product.price}</p>
              <p className="rounded border-2 border-green-700 bg-green-200 text-sm">
                {product.category.toUpperCase()}
              </p>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
