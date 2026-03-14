import { useState, useEffect } from "react";
import css from "./App.module.css";
import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import type { Movie } from "../../types/movie";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  const [selectMovie, setSelectMovie] = useState<Movie | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isError, setIsError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", search, page],
    queryFn: () => fetchMovies(search, page),
    enabled: search.length > 0,
    placeholderData: keepPreviousData,
  });

  const handleSearch = (query: string) => {
    setSearch(query);
    // setIsLoading(true);
    // setIsError(false);
    // setMovies([]);
    setPage(1);

    // const results = await fetchMovies(query, page);
    // setMovies(results);
  };

  useEffect(() => {
    if (data?.results.length === 0) {
      toast("No movies found for your request.");
    }
  }, [data]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    // setPage(0);
  };

  const handleSelect = (movie: Movie) => {
    setSelectMovie(movie);
  };
  const handleCloseModal = () => {
    setSelectMovie(null);
  };

  const totalPages = data?.total_pages ?? 0;

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && isSuccess && (
        <>
          {isSuccess && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid onSelect={handleSelect} movies={data?.results ?? []} />
        </>
      )}

      <Toaster />
      {selectMovie && (
        <MovieModal movie={selectMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default App;
