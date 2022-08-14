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
  const addTicker = async () => {
    const tokenAddress = "0x230A7B9Fa6d65693252C16b04165781722637578";
    const tokenSymbol = "USDC";
    const tokenDecimals = 18;
    const tokenImage = "";

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            Allowance
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Select the currency you would like to give allowance to the recovery
            contract
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormLabel>
              Please enter the EOA you would like to recover:
            </FormLabel>
            <Input type="text" placeholder="0x...abc" />
            <Button>Retrieve Recovery Contract</Button>
            <Text>Here's the existing recovery contract:</Text>
            {/* <Button onClick={addTicker}>Add Fake USDC Ticker</Button> */}
            <HStack>
              <Text>50 USDC</Text>
              <Button>Add</Button>
            </HStack>
            <HStack>
              <Text>100 UNI</Text>
              <Button>Add</Button>
            </HStack>
            <HStack>
              <Text>3.5 WETH</Text>
              <Button>Add</Button>
            </HStack>
            <FormControl id="recovery-address" isRequired>
              <FormLabel>
                Specify ERC20 addresses (separated by commas)
              </FormLabel>
              <Input type="text" placeholder="0x...abc,0x...dfg,0x...xyz" />
            </FormControl>
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
                Allowance
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
