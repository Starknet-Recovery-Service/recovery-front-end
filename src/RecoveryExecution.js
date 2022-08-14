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
  VStack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { useContractRead, useNetwork, erc20ABI, useContractWrite } from "wagmi";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import GatewayContract from "./GatewayContract.json";
import RecoveryContract from "./RecoveryContract.json";

export default function SignupCard() {
  const [EOA, setEOA] = useState();
  const { data: recoveryAddress, refetch: refetchAddress } = useContractRead({
    addressOrName: "0xCA772d547237ea000E5b2C3Ea5067b4b2412Af48",
    contractInterface: GatewayContract,
    functionName: "eoaToRecoveryContract",
    args: [EOA],
  });

  const { data: recipient, refetch: refetchRecipient } = useContractRead({
    addressOrName: recoveryAddress,
    contractInterface: RecoveryContract,
    functionName: "recipient",
  });

  const { data: minBlocks } = useContractRead({
    addressOrName: recoveryAddress,
    contractInterface: RecoveryContract,
    functionName: "minBlocks",
  });

  const { data: isActive } = useContractRead({
    addressOrName: recoveryAddress,
    contractInterface: RecoveryContract,
    functionName: "isActive",
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
            Recovery
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Anyone can trigger the recovery of a contract
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Stack spacing={4}>
              <FormLabel>
                Please enter the wallet address you want to recover from:
              </FormLabel>
              <Input
                type="text"
                placeholder="0x...abc"
                onChange={(e) => setEOA(e.target.value)}
              />
            </Stack>
            {recipient ? (
              <>
                <VStack>
                  <Text>Recovery Contract: {recoveryAddress.toString()}</Text>
                  <Text>Minimum Blocks: {minBlocks.toString()}</Text>
                  <Text>isActive: {isActive.toString()}</Text>
                </VStack>
                <Stack spacing={10} pt={2}>
                  <Button>Call Fossil Api</Button>
                  <Button>Execute recovery on L2</Button>
                  <Button>Activate recovery contract on L1</Button>
                </Stack>
              </>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
