import PropTypes from 'prop-types';
import { GalleryList, GalleryImage } from './ImageGalleryStyle';

export const Gallery = ({ images, onImageClick }) => {
  return (
    <GalleryList>
      {images.map(({ id, webformatURL, largeImageURL }) => (
        <li key={id} onClick={() => onImageClick(largeImageURL)}>
          <GalleryImage src={webformatURL} alt={id} />
        </li>
      ))}
    </GalleryList>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
    })
  ).isRequired,
  onImageClick: PropTypes.func.isRequired,
};
