import { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { QuoteInterface } from '../pages/quotes';
import {
  db,
  incrementCounterDB,
  addComment,
  authorizeUser,
} from '../lib/firebase';
import { doc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';

interface commentInterface {
  value: string;
  author: string;
}

export default function Quote({ rawQuote }: { rawQuote: QuoteInterface }) {
  const { data: session } = useSession();
  if (session === null) return null;

  const [hasFetched, setHasFetched] = useState(false);
  const [quote, setQuote] = useState<any>(undefined);
  const [comments, setComments] = useState<commentInterface[]>([]);
  const [isInsertingComment, setIsInsertingComment] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  // const [canComment] = useState(authorizeUser(session.user.email));

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
    const comment: commentInterface = {
      value: newComment,
      author: session.user.email,
    };

    const id = addComment(rawQuote.id, comment);
    setComments((prevComments) => [...prevComments, comment]);
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
                {comments.map((comment: commentInterface, index) => {
                  return (
                    <li
                      key={index}
                    >{`${comment.value}   - ${comment.author}`}</li>
                  );
                })}
              </ul>
            )}
            {!isInsertingComment && (
              //!!canComment &&
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
