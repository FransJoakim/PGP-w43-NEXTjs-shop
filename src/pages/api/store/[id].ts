import { NextApiRequest, NextApiResponse } from 'next';

export default function product(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
  }

  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.json())
    .then((json) => {
      res.status(200).json(json);
    });
}
