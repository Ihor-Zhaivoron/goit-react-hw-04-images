import { useState, useEffect } from 'react';
import ScrollToTop from 'react-scroll-to-top';
import css from './App.module.css';
// import { func } from 'prop-types';
// =======components========
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

// const API_KEY = '32938330-25a7d9530d370aeaa9b179f57';
// 'https://pixabay.com/api/?key=32938330-25a7d9530d370aeaa9b179f57&image_type=photo&orientation=horizontal&per_page=12';
const API = 'https://pixabay.com/api/?key=32938330-25a7d9530d370aeaa9b179f57';

export function App() {
  const [images, setImages] = useState([]);
  const [activeImg, setActiveImg] = useState(null);
  const [status, setStatus] = useState('blank');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    if (searchText) {
      setStatus('pending');
      fetch(
        `${API}&q=${searchText}&page=${page}&image_type=photo&orientation=horizontal&per_page=12`
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(new Error(`Can't find ${searchText}`));
        })
        .then(data => {
          setImages(state => [...state, ...data.hits]);
          setStatus('resolve');
          setTotalPage(Math.ceil(data.totalHits / 12));
        })
        .catch(error => {
          console.log(error);
          this.setState({ error });
        });
    }
  }, [searchText, page]);

  function onSubmit(searchText) {
    setSearchText(searchText);
    setPage(1);
    setImages([]);
  }
  function onImgClick(image) {
    setActiveImg(image);
    // console.log(image);
  }
  function onClickNextPage() {
    setPage(state => {
      return state + 1;
    });
  }
  function onCloseModal() {
    setActiveImg(null);
  }
  return (
    <div className={css.App}>
      <Searchbar onSubmit={onSubmit} />

      {images.length > 0 && (
        <ImageGallery images={images} onImgClick={onImgClick} />
      )}

      {status === 'pending' && <Loader />}

      {status === 'resolve' && images.length > 0 && page !== totalPage && (
        <Button onClickNextPage={onClickNextPage} />
      )}

      {status === 'resolve' && images.length === 0 && (
        <p className="message">Not found {searchText}</p>
      )}
      {activeImg && <Modal activeImg={activeImg} onCloseModal={onCloseModal} />}

      <ScrollToTop
        smooth
        color="#0519f5"
        viewBox="0 0 27 27"
        svgPath="M25.172 15.172c0 0.531-0.219 1.031-0.578 1.406l-1.172 1.172c-0.375 0.375-0.891 0.594-1.422 0.594s-1.047-0.219-1.406-0.594l-4.594-4.578v11c0 1.125-0.938 1.828-2 1.828h-2c-1.062 0-2-0.703-2-1.828v-11l-4.594 4.578c-0.359 0.375-0.875 0.594-1.406 0.594s-1.047-0.219-1.406-0.594l-1.172-1.172c-0.375-0.375-0.594-0.875-0.594-1.406s0.219-1.047 0.594-1.422l10.172-10.172c0.359-0.375 0.875-0.578 1.406-0.578s1.047 0.203 1.422 0.578l10.172 10.172c0.359 0.375 0.578 0.891 0.578 1.422z"
      />
    </div>
  );
}
