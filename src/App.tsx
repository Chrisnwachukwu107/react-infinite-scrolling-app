import {
  useState,
  useRef,
  useCallback,
  ChangeEvent,
} from 'react';
import useBookSearch from './useBookSearch';
import './App.css';
// import MyComponent from './MyComponent';

function App() {
  const [ query, setQuery ] = useState("");
  const [ pageNumber, setPageNumber ] = useState(1);

  const {
    books,
    hasMore,
    loading,
    error,
  } = useBookSearch({
    query,
    pageNumber
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastBookElementRef = useCallback((node: HTMLDivElement | null) =>
  {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries =>
    {
      if (entries[0].isIntersecting && hasMore) setPageNumber(prevPageNumber => prevPageNumber + 1);
    })
      
    if (node) observer.current.observe(node);
  }, [ loading, hasMore ]);

  function handleSearch(e: ChangeEvent<HTMLInputElement>)
  {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
    {/* <MyComponent></MyComponent> */}
      <input
        type="text"
        value={ query }
        onChange={ handleSearch }
      />
      { books.map((book, index) =>
        {
          if (books.length === index + 1)
          {
            return (
              <div
                key={ book.title }
                ref={ lastBookElementRef }
              >
                { book.title }
              </div>
            )
          }
          else
          {
            return (
              <div
                key= { book.title }
              >
                { book.title }
              </div>
            )
          }
        })}
      <div>
        { loading && 'Loading...' }
      </div>
      <div>
        { error && 'Error' }
      </div>
    </>
  )
}

export default App;
