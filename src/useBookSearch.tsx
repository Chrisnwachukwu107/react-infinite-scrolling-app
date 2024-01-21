import { useEffect, useState } from 'react';
import axios, { Canceler } from 'axios';

interface Props
{
  query: string;
  pageNumber: number;
}

interface Book
{
  title: string;
}

interface HookData
{
  loading: boolean;
  error: boolean;
  books: Book[];
  hasMore: boolean;
}

export default function useBookSearch({
  query,
  pageNumber,
}: Props): HookData
{
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ books, setBooks ] = useState<Book[]>([]);
  const [ hasMore, setHasMore ] = useState(false);

  useEffect(() => setBooks([]), [ query ]);
  
  useEffect(() =>
  {
    setLoading(true);
    setError(false);
    let cancel: Canceler;
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then(res =>
        {
          setBooks((prevBooks) => [ ...new Set([ ...prevBooks, ...res.data.docs ]) ]);
          setHasMore(res.data.docs.length > 0);
          setLoading(false);
        })
      .catch(e =>
        {
          if (axios.isCancel(e)) return;
          setError(true);
        })

        return () => cancel();
  }, [ query, pageNumber ])

  return ({
    loading,
    error,
    books,
    hasMore,
  });
}
