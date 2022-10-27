import { useEffect, useState } from 'react';
import Quote from '@/components/Quote';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { blacklist } from '../lib/firebase';

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
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quotes, setQuotes] = useState<QuotesArray>({ total: 0, result: [] });
  const [blacklistInput, setBlacklistInput] = useState('');

  useEffect(() => {
    if (status !== 'loading') {
      if (status !== 'authenticated') {
        router.push('/login');
      } else {
        fetch('https://api.chucknorris.io/jokes/search?query=hand')
          .then((res) => res.json())
          .then((json) => setQuotes(json));
      }
    }
  }, [status]);

  const handleClick = async () => {
    await blacklist(blacklistInput);
    router.reload();
  };

  return (
    <>
      <div className="little-chuck">
        <Image src="/chuck.webp" alt="Chuck" height="130px" width="100px" />
      </div>
      <div className="mt-60 flex w-full flex-col items-center">
        <div className="border-2">
          <input
            value={blacklistInput}
            onChange={(e) => setBlacklistInput(e.target.value)}
            className="m-2 border-2"
            type="text"
          />
          <button onClick={handleClick} className="m-4">
            Blacklist
          </button>
        </div>
        <ul className="mt-8 w-4/5">
          {quotes.result.map((quote, index) => {
            return <Quote rawQuote={quote} key={index} />;
          })}
        </ul>
      </div>
    </>
  );
}
