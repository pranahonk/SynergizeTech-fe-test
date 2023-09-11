import {Box, Heading} from "@chakra-ui/react";

import type {NextPage} from "next";
import SearchInput from "../Components/SearchInput";
import {useAppDispatch, useAppSelector} from "../store/store";
import {SelectBooks} from "../store/Books.store";
import Card from "../Components/Card";
import Paginate from "../Components/Paginate";
import {getFavorites} from "../store/Favorites.store";
import {useEffect, useState} from "react";


const Home: NextPage = () => {
    const { books } = useAppSelector(SelectBooks);
    const dispatch = useAppDispatch();
    const circleCommonClasses = 'h-2.5 w-2.5 bg-current rounded-full';
    const [isLoading, _] = useState(false);


  useEffect(() => {
    dispatch(getFavorites());
  }, []);

  return (
    <Box p={{ base: "2rem 0.5rem", md: "1rem 2rem" }} flex="1 0  auto">
      <Heading textAlign="center" m="2rem 0">
          Search for your favorite book
      </Heading>
      <Box p="2rem">
        <SearchInput />
      </Box>






      <Box
        margin="0 auto"
        display="flex"
        gap="2rem"
        flexWrap="wrap"
        justifyContent="center"
      >
          {
              isLoading ? (
                  <div className='flex'>
                      <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
                      <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
                      <div className={`${circleCommonClasses} animate-bounce400`}></div>
                  </div>
              ) : (
                  books.map((book) => <Card key={book.id} book={book} />)
              )
          }
      </Box>

      <Box>{books.length > 0 && <Paginate />}</Box>
    </Box>
  );
};

export default Home;
