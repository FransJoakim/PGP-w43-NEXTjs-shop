import Image from 'next/image';
import Link from 'next/link';

import { useState } from 'react';
import { productsInterface } from './index';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export default function ProductInfo({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Link href="/">
        <p className="absolute left-56 top-8 cursor-pointer text-7xl">👋</p>
      </Link>
      <main className="flex h-screen w-full flex-col items-center justify-center pt-10">
        <div className="h-80 w-60">
          <Image
            src={data.image}
            alt="data image"
            height="550px"
            width="500px"
          />
        </div>

        <div className="h-80 w-1/2 [&>*]:p-4">
          <b>{data.title}</b>
          <p>{data.description}</p>
          <div className="flex w-full justify-between">
            <p>${data.price}</p>
            <p className="rounded border-2 border-green-700 bg-green-200 text-sm">
              {data.category.toUpperCase()}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;
  const products = await fetch(`https://fakestoreapi.com/products/${id}`);
  return {
    props: {
      data: await products.json(),
    },
  };
};
