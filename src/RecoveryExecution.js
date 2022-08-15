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
import StorageProver from "./StorageProver.json";
import { addresses } from "./addresses.js";
import {
  useContract,
  useStarknetInvoke,
  useStarknet,
} from "@starknet-react/core";

export default function SignupCard() {
  const [EOA, setEOA] = useState();
  const [blockStart, setBlockStart] = useState();
  const [blockEnd, setBlockEnd] = useState();

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
    args: [EOA, minBlocks],
  });

  // const readNameRes = useStarknetCall({
  //   contract,
  //   method: "sns_lookup_name_to_adr",
  //   args: [encodeNameAsFelt(search)],
  //   options: {
  //     watch: true,
  //   },
  // });

  const { account } = useStarknet();

  const { contract: storageProverContract } = useContract({
    abi: StorageProver.abi,
    address: addresses.StorageProverContractAddress,
  });

  const { invoke } = useStarknetInvoke({
    contract: storageProverContract,
    method: "prove_balance_unchanged",
  });

  const executeOnL2 = () => {
    console.log(BigInt(EOA).toString(), blockStart, blockEnd);
    invoke({
      args: [BigInt(EOA).toString(), blockStart, blockEnd],
      metadata: { method: "prove_balance_unchanged" },
    });
  };

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
          {account ? (
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
                  <Text align="left">
                    Specify Block End (must be within 256 blocks of latest
                    block):{" "}
                  </Text>
                  <Input
                    type="text"
                    placeholder="16000000"
                    onChange={(e) => setBlockEnd(e.target.value)}
                  />
                  <Text align="left">
                    Specify Block Start (must be within `$
                    {minBlocks?.toString()}` blocks of Block End):{" "}
                  </Text>
                  <Input
                    type="text"
                    placeholder="15000000"
                    onChange={(e) => setBlockStart(e.target.value)}
                  />
                  <VStack>
                    <Text>
                      Recovery Contract: {recoveryAddress?.toString()}
                    </Text>
                    <Text>Minimum Blocks: {minBlocks?.toString()}</Text>
                    <Text>isActive: {isActive?.toString()}</Text>
                  </VStack>
                  <Stack spacing={10} pt={2}>
                    <Button>Call Fossil Api</Button>
                    <Button onClick={() => executeOnL2()}>
                      Execute recovery on L2
                    </Button>
                    <Button onClick={() => executeOnL1.write()}>
                      Consume Message on L1
                    </Button>
                  </Stack>
                </>
              ) : null}
            </Stack>
          ) : (
            <Stack spacing={4}>
              <Text>Please connect your Argent wallet.</Text>
            </Stack>
          )}
        </Box>
      </Stack>
    </Flex>
  );
}
