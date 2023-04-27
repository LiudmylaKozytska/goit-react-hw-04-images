import { useState, useEffect, useRef } from 'react';
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

  const prevQueryRef = useRef('');
  const prevPageRef = useRef(1);

  useEffect(() => {
    if (
      query === '' ||
      (query === prevQueryRef.current && page === prevPageRef.current)
    ) {
      return;
    }

    const fetchImages = async () => {
      try {
        setImages(null);
        setLoading(true);
        setStatus('pending');
        setPage(page);

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
          setImages(hits);
          setStatus('rejected');
          setLoadMore(false);
          return;
        }

        if (page === 1) {
          setImages(hits);
          setStatus('resolved');
        } else {
          const newImages = [...images, ...hits];
          setImages(newImages);
          setStatus('resolved');
          setLoadMore(true);
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
    }

    fetchImages();
    prevQueryRef.current = query;
    prevPageRef.current = page;
  }, [query, page, images]);

  const handleFormSubmit = query => {
    setPage(1);
    setQuery(query);
    setLoading(false);
    setStatus('idle');
  };

  const handleLoadMoreClick = () => {
    const nextPage = page + 1;
    setLoading(true);
    setStatus('pending');
    setPage(nextPage);
  };

  const handleImageClick = largeImageURL => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
  };

  const handleCloseModal = () => {
    setLargeImageURL('');
    setShowModal(false);
  };

  return (
    <>
      <SearchForm onSubmit={handleFormSubmit} />
      {images && <Gallery images={images} onImageClick={handleImageClick} />}
      {loadMore && <LoadMoreButton onClick={handleLoadMoreClick} />}
      {showModal && (
        <Modal onClose={handleCloseModal} largeImageURL={largeImageURL} />
      )}
      {loading && (
        <LoadingPage>
          <LoaderSpinner />
        </LoadingPage>
      )}
      {status === 'rejected' && <ToastContainer autoClose={3000} />}
    </>
  );
}
