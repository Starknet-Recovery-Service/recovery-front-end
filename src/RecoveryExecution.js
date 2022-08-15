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
import { addresses } from "./addresses.js";
import { useStarknetCall, useStarknetInvoke } from "@starknet-react/core";

export default function SignupCard() {
  const [EOA, setEOA] = useState();
  const { data: recoveryAddress, refetch: refetchAddress } = useContractRead({
    addressOrName: addresses.GateWayContractAddress,
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

  const executeOnL1 = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: addresses.GateWayContractAddress,
    contractInterface: GatewayContract,
    functionName: "receiveFromStorageProver",
    args: [EOA, minBlocks, ""],
  });

  // const readNameRes = useStarknetCall({
  //   contract,
  //   method: "sns_lookup_name_to_adr",
  //   args: [encodeNameAsFelt(search)],
  //   options: {
  //     watch: true,
  //   },
  // });

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
            Trigger the recovery of assets from your lost account
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
                Please enter the address of the EOA you would like to recover:
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
                  <Text>Recovery contract: {recoveryAddress.toString()}</Text>
                  <Text>Minimum blocks: {minBlocks.toString()}</Text>
                  <Text>Able to withdraw: {isActive.toString()}</Text>
                </VStack>
                <Stack spacing={10} pt={2}>
                  <Button>Call Fossil API to request storage proof</Button>
                  <Button>Execute recovery on L2</Button>
                  <Button onClick={() => executeOnL1.write()}>
                    Consume Message on L1
                  </Button>
                </Stack>
              </>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
