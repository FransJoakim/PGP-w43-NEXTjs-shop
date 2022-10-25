import { useEffect, useState } from 'react';
import { getUtterances, incrementCounterDB } from '../lib/firebase';

interface Quote {
  categories: string[];
  created_at: Date;
  icon_url: string;
  id: string;
  updated_at: Date;
  url: string;
  value: string;
  utterances?: number;
}

interface QuotesArray {
  total: number;
  result: Quote[];
}

export interface UtteranceDataInterface {
  id: string;
  charlieUttrance: number;
}

export default function () {
  const [quotes, setQuotes] = useState<QuotesArray>({ total: 0, result: [] });
  const [quotesWithCount, setQuotesWithCount] = useState<Quote[]>([]);

  useEffect(() => {
    fetch('https://api.chucknorris.io/jokes/search?query=hand')
      .then((res) => res.json())
      .then((json) => setQuotes(json));
  }, []);

  useEffect(() => {
    const updateWithUtterances = async () => {
      const utteranceList = await getUtterances();
      const updatedQuotes = quotes.result.map((quote) => {
        quote.utterances = utteranceList.find(
          (q: UtteranceDataInterface) => q.id === quote.id,
        ).charlieUttrance;
        return quote;
      });

      setQuotesWithCount(updatedQuotes);
    };
    updateWithUtterances();
  }, [quotes]);

  const incrementCounter = (id: string) => {
    incrementCounterDB(id);
    const temp = quotesWithCount.map((quote) => {
      if (quote.id === id) {
        //@ts-ignore
        return { ...quote, utterances: quote.utterances + 1 };
      } else return quote;
    });
    setQuotesWithCount(temp);
  };

  return (
    <div className="flex w-full justify-center">
      <ul className="mt-8 w-4/5">
        {quotesWithCount.map((quote, index) => {
          return (
            <li className="mt-12" key={index}>
              <p>{quote.value}</p>
              <button
                className="text-sm"
                onClick={() => incrementCounter(quote.id)}
              >
                <b># Charlie uttarances: {quote.utterances}</b>
                <p>{quote.id}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
