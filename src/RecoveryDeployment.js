import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Recovery Contract Deployment
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Please deploy a recovery contract for your EOA account using your
            Ethereum wallet.
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="recovery-address" isRequired>
              <FormLabel>Specify Recovery Address</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl id="recovery-address" isRequired>
              <FormLabel>Specify the minimum duration (# of blocks)</FormLabel>
              <Input type="text" placeholder="1000000" />
            </FormControl>
            <Text align="left">2.5m blocks roughly equals 1 year</Text>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Deploy Recovery Contract
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already deployed a recovery contract? Give token allowance to
                the contract: <Link color={"blue.400"}>Allowance</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
