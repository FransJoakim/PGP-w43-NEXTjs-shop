import { useEffect, useState } from 'react';
import Quote from '@/components/Quote';

export interface QuoteInterface {
  categories: string[];
  created_at: Date;
  icon_url: string;
  id: string;
  updated_at: Date;
  url: string;
  value: string;
  utterances?: number;
  comments?: string[];
  commentsCount?: number;
}

interface QuotesArray {
  total: number;
  result: QuoteInterface[];
}

export default function () {
  const [quotes, setQuotes] = useState<QuotesArray>({ total: 0, result: [] });

  useEffect(() => {
    fetch('https://api.chucknorris.io/jokes/search?query=hand')
      .then((res) => res.json())
      .then((json) => setQuotes(json));
  }, []);

  return (
    <div className="flex w-full justify-center">
      <ul className="mt-8 w-4/5">
        {quotes.result.map((quote, index) => {
          return <Quote rawQuote={quote} key={index} />;
        })}
      </ul>
    </div>
  );
}
