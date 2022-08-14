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
import { useState, useEffect } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useContractRead, useNetwork, erc20ABI } from "wagmi";
import GatewayContract from "./GatewayContract.json";

export default function SignupCard() {
  const [recipient, setRecipient] = useState();
  const { chain } = useNetwork();
  // const {
  //   data: address,
  //   // isError: isErrorBalanceOf,
  //   refetch,
  // } = useContractRead({
  //   // mode: "recklesslyUnprepared",
  //   addressOrName: "0xCA772d547237ea000E5b2C3Ea5067b4b2412Af48",
  //   contractInterface: GatewayContract,
  //   functionName: "eoaToRecoveryContract",
  //   // watch: true,
  //   // chainId: 5,
  //   args: ["0x34b716a2b8bfebc37322f6e33b3472d71bbc5631"],
  // });

  const {
    data: usdcBalance,
    // isError: isErrorBalanceOf,
    refetch,
  } = useContractRead({
    // mode: "recklesslyUnprepared",
    addressOrName: "0xf3D16db53cFCee5d26EE29cDeeaa49215A21d345",
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    // watch: true,
    // chainId: 5,
    args: "0x34b716a2b8bfebc37322f6e33b3472d71bbc5631",
  });

  console.log(usdcBalance);

  // console.log(chain);
  // console.log(address);
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
            <Input
              type="text"
              placeholder="0x...abc"
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Button
              onClick={async () => {
                refetch();
              }}
            >
              Retrieve Recovery Contract
            </Button>
            {/* <Text>{address && address.toString()}</Text> */}
            <Text>{usdcBalance && usdcBalance.toString()}</Text>
            <Text>Here's the existing recovery contract:</Text>
            <HStack>
              <Text>50 USDC</Text>
              <Button>Approve</Button>
            </HStack>
            <HStack>
              <Text>100 UNI</Text>
              <Button>Approve</Button>
            </HStack>
            <HStack>
              <Text>3.5 WETH</Text>
              <Button>Approve</Button>
            </HStack>
            <Stack spacing={10} pt={2}>
              {/* <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Give Allowance
              </Button> */}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
