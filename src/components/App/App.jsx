import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import SearchForm from '../Searchbar/Searchbar';
import { Gallery } from '../ImageGallery/ImageGallery';
import { LoadMoreButton } from '../Button/Button';
import { LoaderSpinner } from '../Loader/Loader';
import { Modal } from '../Modal/Modal';
import { LoadingPage } from './AppStyle';

const API_KEY = '34170895-3b717d95f13cef959b3654060';

export default function App() {
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    if (query === '') {
      return;
    }

    const fetchImages = async () => {
      setLoading(true);
      setStatus('pending');
      setPage(1);

      try {
        const response = await axios.get(
          `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
        );

        const hits = response.data.hits.map(
          ({ id, largeImageURL, webformatURL }) => ({
            id,
            largeImageURL,
            webformatURL,
          })
        );

        if (hits.length === 0) {
          toast.error(`Ups...we have not ${query} images...`);
          setImages(null);
          setStatus('rejected');
          setLoadMore(false);
          return;
        }

        if (page === 1) {
          setImages(hits);
          setStatus('resolved');
        } else {
          setImages(prevImages => [...prevImages, ...hits]);
          setStatus('resolved');
        }

        if (response.data.totalHits > page * 12) {
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
      } catch (error) {
        console.log(error);
        setStatus('rejected');
      } finally {
        setLoading(false);
      }
    };

    if (query !== '') {
      setPage(1);
      setImages(null);
      setLoadMore(false);
      fetchImages();
    }

    fetchImages();
  }, [query, page]);

  const handleFormSubmit = query => {
    setQuery(query);
    setLoading(false);
    setStatus('idle');
  };

  const handleLoadMoreClick = () => {
    setLoading(true);
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = largeImageURL => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (status === 'idle') {
    return <SearchForm onSubmit={handleFormSubmit} value={query} />;
  }

  if (status === 'pending' && images === null) {
    return (
      <>
        <SearchForm onSubmit={handleFormSubmit} value={query} />
        <LoadingPage>
          <LoaderSpinner />
        </LoadingPage>
      </>
    );
  }

  if (status === 'rejected') {
    return (
      <div>
        <SearchForm onSubmit={handleFormSubmit} value={query} />
        <ToastContainer autoClose={3000} />
      </div>
    );
  }

  return (
    <div>
      <SearchForm onSubmit={handleFormSubmit} value={query} />

      {images && <Gallery images={images} onImageClick={handleImageClick} />}

      {loading && (
        <LoadingPage>
          <LoaderSpinner />
        </LoadingPage>
      )}

      {loadMore && loading && <LoadMoreButton onClick={handleLoadMoreClick} />}

      {showModal && (
        <Modal onClose={handleCloseModal} largeImageURL={largeImageURL}></Modal>
      )}
    </div>
  );
}
