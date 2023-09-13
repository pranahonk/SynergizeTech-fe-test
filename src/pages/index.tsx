import {Box, Heading, Select} from "@chakra-ui/react";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import type {NextPage} from "next";
import SearchInput from "../Components/SearchInput";
import {useAppDispatch, useAppSelector} from "../store/store";
import {SelectBooks, filterBooks, filterYear} from "../store/Books.store";
import Card from "../Components/Card";
import Paginate from "../Components/Paginate";
import {getFavorites} from "../store/Favorites.store";
import {useEffect, useState} from "react";


const Home: NextPage = () => {
    const { books } = useAppSelector(SelectBooks);
    const dispatch = useAppDispatch();
    const circleCommonClasses = 'h-2.5 w-2.5 bg-current rounded-full';
    const [isLoading, _] = useState(false);
    const [select, setSelect] = useState('');
    const [grid, setGrid] = useState('grid');
    const [startDate, setStartDate] = useState(new Date("2015/02/08"));
    const [endDate, setEndDate] = useState(new Date("2023/04/08"));



    useEffect(()=>{
        console.log(books);
    }, [books])


  useEffect(() => {
    dispatch(getFavorites());
  }, []);


  useEffect(() => {
      dispatch(filterBooks(select));
  }, [select]);

    const handleChange = ([newStartDate, newEndDate]: [any, any]) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);

        dispatch(filterYear({newStartDate, newEndDate}));
    };


    return (
    <Box p={{ base: "2rem 0.5rem", md: "1rem 2rem" }} flex="1 0  auto">
      <Heading textAlign="center" m="2rem 0">
          Search for your favorite book
      </Heading>
      <Box p="2rem">
          <SearchInput />
      </Box>
        {
            books?.length > 0 && (
                <div className="px-[2rem] grid grid-cols-5 grid-rows-1 gap-4">
                    <Select placeholder='Urutkan'
                            onChange={(e) => setSelect(e.target.value)}
                    >
                        <option value='title'>Judul Buku</option>
                        <option value='year'>Tahun Buku</option>
                    </Select>
                    <DatePicker
                        selected={startDate}
                        onChange={handleChange}
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy"
                        showYearPicker
                        className="h-[40px] w-full"
                    />
                    <Select defaultValue={'grid'}
                            onChange={(e) => setGrid(e.target.value)}
                    >
                        <option value='grid'>Grid</option>
                        <option value='list'>List</option>
                    </Select>
                </div>
            )

        }


      <Box
        margin="0 auto"
        display="flex"
        gap="2rem"
        flexWrap="wrap"
        justifyContent="center"
        paddingTop="2rem"
      >
          {
              isLoading ? (
                  <div className='flex'>
                      <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
                      <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
                      <div className={`${circleCommonClasses} animate-bounce400`}></div>
                  </div>
              ) : (
                  books.map((book) => <Card key={book.id} book={book} view={grid} />)
              )
          }
      </Box>

      <Box>{books.length > 0 && <Paginate />}</Box>
    </Box>
  );
};

export default Home;
