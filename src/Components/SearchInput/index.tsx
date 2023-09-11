import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {SearchIcon} from '@chakra-ui/icons';
import {InputGroup, InputRightElement, FormErrorMessage} from '@chakra-ui/react';
import useDebounce from '../../hooks/useDebounce';
import {cleanStates, getBooksWithTerms, setTerms,} from '../../store/Books.store';
import {useAppDispatch} from '../../store/store';

const SearchInput = () => {
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();

  const debounceSearch = useDebounce(search, 1000);
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm({
        mode: "onChange" // "onChange"
    });

  const handleSearch = async (terms: string) => {
    dispatch(setTerms(terms));
    dispatch(getBooksWithTerms({ page: 0, terms }));

      if (search.length < 3) {
          setError('Minimum length should be 3');
      } else if (search.length > 36) {
          setError('Maximum length should not exceed 36');
      } else {
          setError('');
      }
  };

  useEffect(() => {
    if (search) {
      handleSearch(search);
      return;
    }

    dispatch(cleanStates());
  }, [debounceSearch, dispatch, search]);

  return (
      <>
          <InputGroup display="flex">
              <InputRightElement
                  alignContent="center"
                  pointerEvents="none"
                  top="4px"
              >
                  <SearchIcon alignSelf="center" fontSize="22px" />
              </InputRightElement>
              <input
                  className={`w-full h-[50px] min-w-0 outline-none outline-offset-2 relative appearance-none 
                transition-[background-color,border-color,color,fill,stroke,opacity,box-shadow,transform] 
                duration-['200ms'] text-["1.125rem"] font-bold rounded-["0.375rem"] border-[3px] 
                border-solid border-["#DADADA"] placeholder-black py-[4px] px-[10px]`}
                  placeholder="luo"
                  {...register('search', {
                      required: 'This is required',
                      minLength: { value: 3, message: 'Minimum length should be 3' },
                      maxLength: {value: 36, message: 'Maximum length should be not exceed 36' }
                  })}
                  onChange={(e) => setSearch(e.target.value)}
              />
              {error && (
                  <FormErrorMessage>
                      {error}
                  </FormErrorMessage>
              )}
          </InputGroup>
      </>
  );
};

export default SearchInput;
