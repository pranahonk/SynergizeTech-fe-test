import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <Box
      as="header"
      bg="white"
      h="70px"
      display="grid"
      p="1rem"
      w="100%"
      alignItems="center"
      gridTemplateColumns="1fr 1fr"
    >
      <Box display="flex" alignItems="center" fontSize="1.2rem" gap="0.5rem">
        <Text fontWeight="bold">SynergizeTech Books</Text>
      </Box>

      <Box justifySelf="flex-end" display="flex" gap="1.2rem">
        <Link href="/" passHref>
          <Box as="a" fontWeight="bold" color="gray.500">
            <Text>Home</Text>
          </Box>
        </Link>

        <Link href="/favorites" passHref>
          <Box
            as="a"
            fontWeight="bold"
            color="gray.500"
            display="flex"
            alignItems="baseline"
          >
            <Text mr="5px">Favorite</Text>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default Header;
