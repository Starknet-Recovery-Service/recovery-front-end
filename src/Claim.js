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
import RecoveryContract from "./RecoveryContract.json";
import { dummyCoins } from "./mappings";

export default function SignupCard() {
  const [recoveryAddress, setRecoveryAddress] = useState();
  const { chain } = useNetwork();
  const { data: recipient, refetch: refetchRecipient } = useContractRead({
    addressOrName: recoveryAddress,
    contractInterface: RecoveryContract,
    functionName: "recipient",
  });

  const { data: usdcBalance, refetch: fetchUsdcBalance } = useContractRead({
    addressOrName: dummyCoins["USDC"],
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: recoveryAddress,
  });

  const { data: uniBalance, refetch: fetchUniBalance } = useContractRead({
    addressOrName: dummyCoins["UNI"],
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: recoveryAddress,
  });

  const { data: wethBalance, refetch: fetchWethBalance } = useContractRead({
    addressOrName: dummyCoins["WETH"],
    contractInterface: erc20ABI,
    functionName: "balanceOf",
    args: recoveryAddress,
  });

  const claimUSDC = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: dummyCoins["USDC"],
    contractInterface: erc20ABI,
    functionName: "transfer",
    args: [recipient, usdcBalance],
  });

  const claimUNI = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: dummyCoins["UNI"],
    contractInterface: erc20ABI,
    functionName: "transfer",
    args: [recipient, uniBalance],
  });

  const claimWETH = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: dummyCoins["WETH"],
    contractInterface: erc20ABI,
    functionName: "transfer",
    args: [recipient, wethBalance],
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
            Claim
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Once you have finished activating the recovery contract, you can
            claim the assets here.
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
              Please enter the recovery contract you would like claim asssets
              from:
            </FormLabel>
            <Input
              type="text"
              placeholder="0x...abc"
              onChange={(e) => setRecoveryAddress(e.target.value)}
            />
          </Stack>
          {recipient ? (
            <>
              <Text>
                Here's the designated recipient of the recovery contract:
              </Text>
              <Text>{recipient && recipient.toString()}</Text>
              <HStack>
                <Text>
                  {usdcBalance && (usdcBalance / 1e18).toString()} USDC
                </Text>
                <Button onClick={() => claimUSDC.write()}>Claim USDC</Button>
              </HStack>
              <HStack>
                <Text>{uniBalance && (uniBalance / 1e18).toString()} UNI</Text>
                <Button onClick={() => claimUNI.write()}>Claim UNI</Button>
              </HStack>
              <HStack>
                <Text>
                  {wethBalance && (wethBalance / 1e18).toString()} WETH
                </Text>
                <Button onClick={() => claimWETH.write()}>Claim WETH</Button>
              </HStack>
            </>
          ) : null}
        </Box>
      </Stack>
    </Flex>
  );
}
