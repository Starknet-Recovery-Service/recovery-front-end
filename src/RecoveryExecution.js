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
import { useState, useRef, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {
  useContractRead,
  useNetwork,
  useBlockNumber,
  erc20ABI,
  useContractWrite,
} from "wagmi";
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
import axios from "axios";

export default function SignupCard() {
  const ws = useRef(null);
  const [socketInfo, setSocketInfo] = useState();
  const [EOA, setEOA] = useState();
  const [showStatus, setShowStatus] = useState(false);

  // Socket connection should be setup once and only once and closed properly
  useEffect(() => {
    ws.current = new W3CWebSocket("ws:/localhost:3009");

    ws.current.onopen = () => {
      console.log("Socket opened");
    };

    ws.current.onclose = () => {
      console.log("Socket closed");
    };

    ws.current.onmessage = (message) => {
      const data = message.data;
      setSocketInfo(JSON.parse(data));
      console.log(data);
    };

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  const blockNumber = useBlockNumber({
    chainId: 5,
  });

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
    args: [BigInt(EOA), Number(minBlocks)],
  });

  const callFossil = () => {
    console.log("called");
    console.log(socketInfo);
    console.log(socketInfo?.userID);
    console.log(blockNumber.data);
    console.log(blockNumber.data - Number(minBlocks));
    setShowStatus(true);
    // axios
    //   .post("http://localhost:3009/callFossil", {
    //     blockNumber: blockNumber.data,
    //     recoveryContract: recoveryAddress?.toString(),
    //     userID: socketInfo.userID,
    //     duration: minBlocks,
    //   })
    //   .then((result) => console.log(result.data))
    //   .catch((err) => console.log(err));
    const request1 = {
      originChain: "ethereum",
      destinationChain: "starknet",
      block: blockNumber.data,
      useNonce: true,
      webhook: {},
    };
    const request2 = {
      originChain: "ethereum",
      destinationChain: "starknet",
      block: blockNumber.data - Number(minBlocks),
      useNonce: true,
      webhook: {},
    };

    axios
      .post(
        "https://d9b8-2001-8a0-6a40-7200-e1d2-36fe-dfd7-838f.eu.ngrok.io",
        request1
      )
      .then((result) => console.log(result.data))
      .catch((err) => console.log(err));

    axios
      .post(
        "https://d9b8-2001-8a0-6a40-7200-e1d2-36fe-dfd7-838f.eu.ngrok.io",
        request2
      )
      .then((result) => console.log(result.data))
      .catch((err) => console.log(err));
  };

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
    console.log(
      BigInt(EOA).toString(),
      blockNumber.data - Number(minBlocks),
      blockNumber.data
    );
    invoke({
      args: [
        BigInt(EOA).toString(),
        blockNumber.data - Number(minBlocks),
        blockNumber.data,
      ],
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
            Trigger the recovery of assets from your lost account
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
                  <VStack>
                    <Text>
                      Recovery Contract: {recoveryAddress?.toString()}
                    </Text>
                    <Text>Minimum Blocks: {minBlocks?.toString()}</Text>
                    <Text>isActive: {isActive?.toString()}</Text>
                  </VStack>
                  <Stack spacing={10} pt={2}>
                    <Button onClick={() => callFossil()}>
                      Call Fossil API to request storage proof
                    </Button>
                    {showStatus ? (
                      <>
                        <Text>Status: {socketInfo?.message}</Text>
                        <Text>
                          blockstart: {blockNumber?.data - Number(minBlocks)}
                        </Text>
                        <Text>blockend: {blockNumber?.data}</Text>
                      </>
                    ) : null}
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
