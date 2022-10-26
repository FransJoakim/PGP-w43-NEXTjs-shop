import { NextApiRequest, NextApiResponse } from 'next';

export default function store(_req: NextApiRequest, res: NextApiResponse) {
  fetch('https://fakestoreapi.com/products')
    .then((res) => res.json())
    .then((json) => {
      res.status(200).json(json);
    });
}
