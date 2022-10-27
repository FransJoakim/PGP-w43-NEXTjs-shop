import { useEffect, useState, MouseEvent } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  FieldValue,
  orderBy,
} from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { QuoteInterface } from '../pages/quotes';
import {
  db,
  incrementCounterDB,
  addComment,
  authorizeUser,
} from '../lib/firebase';

export interface commentInterface {
  value: string;
  author: string;
  createdAt: FieldValue;
}

export default function Quote({ rawQuote }: { rawQuote: QuoteInterface }) {
  const { data: session } = useSession();
  if (session === null) return null;

  const [hasFetched, setHasFetched] = useState(false);
  const [quote, setQuote] = useState<any>(undefined);
  const [comments, setComments] = useState<commentInterface[]>([]);
  const [isInsertingComment, setIsInsertingComment] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [canComment, setCanComment] = useState(true);

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

    const authorize = async () => {
      setCanComment(await authorizeUser(session.user.email));
    };
    authorize();

    return unsub;
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (hasFetched) {
      if (quote.commentsCount) {
        const q = query(
          collection(db, 'quotes', rawQuote.id, 'comments'),
          orderBy('createdAt'),
        );
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const temp: commentInterface[] = [];
          querySnapshot.forEach((doc) => {
            //@ts-ignore
            temp.push(doc.data());
          });
          setComments(temp);
        });
      }
    }
    return unsubscribe;
  }, [hasFetched]);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    const comment: commentInterface = {
      value: newComment,
      author: session.user.email,
      createdAt: serverTimestamp(),
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
            {!isInsertingComment && !!canComment && (
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
