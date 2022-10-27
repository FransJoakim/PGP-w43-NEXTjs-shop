import { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { QuoteInterface } from '../pages/quotes';
import { db, incrementCounterDB, addComment } from '../lib/firebase';
import { doc, collection, getDocs, onSnapshot } from 'firebase/firestore';

export default function Quote({ rawQuote }: { rawQuote: QuoteInterface }) {
  const [hasFetched, setHasFetched] = useState(false);
  const [quote, setQuote] = useState<any>(undefined);
  const [comments, setComments] = useState<string[]>([]);

  const [isInsertingComment, setIsInsertingComment] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'quotes', rawQuote.id), (doc) => {
      if (doc.exists()) {
        setQuote({
          ...rawQuote,
          utterances: doc.data().charlieUttrance,
          commentsCount: doc.data().commentsCount,
        });
        setHasFetched(true);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (hasFetched) {
      if (quote.commentsCount) {
        const temp: any = [];

        const fetchComments = async () => {
          const querySnapshot = await getDocs(
            collection(db, 'quotes', rawQuote.id, 'comments'),
          );
          querySnapshot.forEach((doc) => {
            console.log(doc.data());
            temp.push(doc.data().value);
          });
          setComments(temp);
        };
        fetchComments();
      }
    }
  }, [hasFetched]);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    const id = addComment(rawQuote.id, newComment);
    setComments((prevComments) => [...prevComments, newComment]);
    setNewComment('');
    setIsInsertingComment(false);
  };

  return (
    <>
      {quote && (
        <li className="mt-12">
          <p>{quote.value}</p>
          <p>{quote.id}</p>
          <button
            className="text-sm"
            onClick={() => incrementCounterDB(quote.id)}
          >
            <b># Charlie uttarances: {quote.utterances}</b>
          </button>
          <div>
            {comments.length > 0 && (
              <ul className="m-4">
                <p>
                  <b>Comments</b>
                </p>
                {comments.map((comment: string, index) => {
                  return <li key={index}>{comment}</li>;
                })}
              </ul>
            )}
            {!isInsertingComment && (
              <button onClick={() => setIsInsertingComment(true)}>
                <i>Add comment</i>
              </button>
            )}
            {isInsertingComment && (
              <div>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleClick}>Add</button>
              </div>
            )}
          </div>
        </li>
      )}
    </>
  );
}
