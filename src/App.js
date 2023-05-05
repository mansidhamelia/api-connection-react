import React, { useState, useEffect, useCallback } from 'react';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)


  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://react-htttp-ac816-default-rtdb.firebaseio.com/movies.json')
      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      const data = await response.json()

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }

      setMovies(loadedMovies)
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false)
  }, [])

  // use useEffect to send http request Immediately when component loads and not just on button click
  useEffect(() => {
    fetchMoviesHandler()
  }, [fetchMoviesHandler])

  async function addMovieHandler(movie) {
    // fetch is not use to only fetch data but also send data

    // use api of firebase database
    const response = await fetch('https://react-htttp-ac816-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'content-type': 'application/json'
      }
    })
    const data = await response.json()
    console.log(data)
  }

  let content = <p>Found no movies.</p>

  if (isLoading) {
    content = <p>Loading...</p>
  }
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />
  }
  if (error) {
    content = <p>{error}</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* inline conditions */}
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && < p > Found no movies.</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>} */}

        {content}
      </section>
    </React.Fragment >
  );
}

export default App;
