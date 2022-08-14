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
import { useContractRead, useNetwork, erc20ABI, useContractWrite } from "wagmi";
import GatewayContract from "./GatewayContract.json";
import { dummyCoins } from "./mappings";
import { addresses } from "./addresses.js";

export default function SignupCard() {
  const [recipient, setRecipient] = useState();
  const { chain } = useNetwork();
  const { data: address, refetch: refetchAddress } = useContractRead({
    addressOrName: addresses.GateWayContractAddress,
    contractInterface: GatewayContract,
    functionName: "eoaToRecoveryContract",
    args: [recipient],
  });

  const { data: usdcBalance, refetch: fetchUsdcBalance } = useContractRead({
    addressOrName: dummyCoins["USDC"],
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: recipient,
  });

  const { data: uniBalance, refetch: fetchUniBalance } = useContractRead({
    addressOrName: dummyCoins["UNI"],
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: recipient,
  });

  const { data: wethBalance, refetch: fetchWethBalance } = useContractRead({
    addressOrName: dummyCoins["WETH"],
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: recipient,
  });

  const approveUSDC = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: dummyCoins["USDC"],
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [address, usdcBalance],
  });

  const approveUNI = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: dummyCoins["UNI"],
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [address, uniBalance],
  });

  const approveWETH = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: dummyCoins["WETH"],
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [address, wethBalance],
  });

  return (
    <Flex
      minH={"100vh"}
      // align={"center"}
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
            {/* <Button
              onClick={async () => {
                refetchAddress();
              }}
            >
              Retrieve Recovery Contract
            </Button> */}
            {address &&
            address !== "0x0000000000000000000000000000000000000000" ? (
              <>
                <Text>Here's the existing recovery contract:</Text>
                <Text>{address && address.toString()}</Text>
                <HStack>
                  <Text>
                    {usdcBalance && (usdcBalance / 1e18).toString()} USDC
                  </Text>
                  <Button onClick={() => approveUSDC.write()}>
                    Approve USDC
                  </Button>
                </HStack>
                <HStack>
                  <Text>
                    {uniBalance && (uniBalance / 1e18).toString()} UNI
                  </Text>
                  <Button onClick={() => approveUNI.write()}>
                    Approve UNI
                  </Button>
                </HStack>
                <HStack>
                  <Text>
                    {wethBalance && (wethBalance / 1e18).toString()} WETH
                  </Text>
                  <Button onClick={() => approveWETH.write()}>
                    Approve WETH
                  </Button>
                </HStack>
              </>
            ) : null}
            {address &&
            address === "0x0000000000000000000000000000000000000000" ? (
              <Text align={"center"}>
                You don't have a recovery contract deployed yet.
              </Text>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
