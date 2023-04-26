import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineImageSearch } from 'react-icons/md';

import { Header, Input, Button } from './SearchbarStyle';

export default function SearchForm({ onSubmit }) {
  const [inputQuery, setInputQuery] = useState('');

  const handleQueryChange = event => {
    setInputQuery(event.target.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (inputQuery.trim() === '') {
      return toast.error('Please, type something...');
    }

    onSubmit(inputQuery);
    setInputQuery('');
  };

  return (
    <Header>
      <form
        onSubmit={e => {
          handleSubmit(e);
        }}
      >
        <Button type="submit">
          <MdOutlineImageSearch />
        </Button>
        <Input
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleQueryChange}
          value={inputQuery}
        />
      </form>
    </Header>
  );
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
