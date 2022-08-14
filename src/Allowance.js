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
  const { data: address, refetch: refetchAddress } = useContractRead({
    addressOrName: "0xCA772d547237ea000E5b2C3Ea5067b4b2412Af48",
    contractInterface: GatewayContract,
    functionName: "eoaToRecoveryContract",
    args: [recipient],
  });

  const { data: usdcBalance, refetch: fetchUsdcBalance } = useContractRead({
    addressOrName: "0xf3D16db53cFCee5d26EE29cDeeaa49215A21d345",
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: recipient,
  });

  const { data: uniBalance, refetch: fetchUniBalance } = useContractRead({
    addressOrName: "0x3E1722c57f5439b5279bA7Bd9Db37f667eAF2Bc9",
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: recipient,
  });

  const { data: wethBalance, refetch: fetchWethBalance } = useContractRead({
    addressOrName: "0x5E4921e55D88f1E61AcD35adE5cAfce3F3FcA7a6",
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: recipient,
  });
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
                refetchAddress();
              }}
            >
              Retrieve Recovery Contract
            </Button>
            {address !== "0x0000000000000000000000000000000000000000" ? (
              <>
                <Text>Here's the existing recovery contract:</Text>
                <Text>{address && address.toString()}</Text>
                <HStack>
                  <Text>
                    {usdcBalance && (usdcBalance / 1e18).toString()} USDC
                  </Text>
                  <Button>Approve USDC</Button>
                </HStack>
                <HStack>
                  <Text>
                    {uniBalance && (uniBalance / 1e18).toString()} UNI
                  </Text>
                  <Button>Approve UNI</Button>
                </HStack>
                <HStack>
                  <Text>
                    {wethBalance && (wethBalance / 1e18).toString()} WETH
                  </Text>
                  <Button>Approve WETH</Button>
                </HStack>
              </>
            ) : (
              <Text align={"center"}>
                You don't have a recovery contract deployed yet.
              </Text>
            )}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
