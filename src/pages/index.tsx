import Layout from '@/components/layout';
import { useEffect, useState } from 'react';
// import products from '../lib/data.json';
import Image from 'next/image';
import { useRouter } from 'next/router';

export interface productsInterface {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function IndexPage() {
  const router = useRouter();
  const [productsList, setProductsList] = useState<productsInterface[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProductsList, setFilteredProductsList] = useState<
    productsInterface[]
  >([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((json) => {
        setProductsList(json);
        setFilteredProductsList(json);
      });
  }, []);

  useEffect(() => {
    let temp: string[] = [];
    productsList.forEach((product) => {
      if (!temp.includes(product.category)) {
        temp.push(product.category);
      }
    });
    setCategories(temp);
  }, [productsList]);

  const handleClick = (e: React.MouseEvent<HTMLElement>, productId: number) => {
    e.preventDefault();
    router.push(`/${productId}`);
  };

  const filterOptions = (filter: string) => {
    if (filter !== 'all') {
      const filteredList = productsList.filter(
        (product) => product.category === filter,
      );
      setFilteredProductsList(filteredList);
    } else {
      setFilteredProductsList(productsList);
    }
  };

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <main>
        <div className="flex min-h-screen flex-col items-center justify-center p-20 text-center">
          <div className="flex h-80 flex-col justify-center">
            <div>
              <h1 className="text-5xl">Hello customer 👋</h1>
              <h2 className="text-xl">
                Have a look through our shop catalogue
              </h2>
            </div>
            {categories && (
              <select
                className="mt-6"
                onChange={(e) => filterOptions(e.target.value)}
              >
                <option value="all" key="all">
                  All
                </option>
                {categories.map((category) => {
                  return (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
          <section className="w-6/7 flex flex-wrap justify-center gap-8">
            {filteredProductsList.map((product, index) => {
              return (
                <article
                  key={index}
                  className="h-46 w-48 rounded border-2 border-solid bg-gray-200 "
                  onClick={(e) => handleClick(e, product.id)}
                >
                  <Image
                    src={product.image}
                    alt="product image"
                    height="220rem"
                    width="200rem"
                  />
                  <div className="flex h-36 flex-col justify-between">
                    <div>
                      <b>{product.title}</b>
                      <p>${product.price}</p>
                    </div>
                    <p className="text-sm">{product.category.toUpperCase()}</p>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </Layout>
  );
}
