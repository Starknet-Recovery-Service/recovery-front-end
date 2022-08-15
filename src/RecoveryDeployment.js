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
import { useContractWrite, useNetwork } from "wagmi";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import GatewayContract from "./GatewayContract.json";
import { addresses } from "./addresses.js";

export default function SignupCard() {
  const [recipient, setRecipient] = useState();
  const [duration, setDuration] = useState();

  const deployContract = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: addresses.GateWayContractAddress,
    contractInterface: GatewayContract,
    functionName: "deployRecoveryContract",
    args: [recipient, duration],
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
            Deploy Recovery Contract
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Deploy a recovery contract which can be used to recover your funds
            in case you lose your account details.
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
              <FormLabel>
                Specify recovery address (account to send lost funds to)
              </FormLabel>
              <Input
                type="text"
                placeholder="0x...abc"
                onChange={(e) => {
                  setRecipient(e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="recovery-address" isRequired>
              <FormLabel>Specify the minimum duration (# of blocks)</FormLabel>
              <Input
                type="text"
                placeholder="1000000"
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
              />
            </FormControl>
            <Text align="left" as="i">
              This is the minimum amount of time that your account must be left
              idle (i.e. no outgoing transactions) before it is deemed to be
              lost and the recovery process can be initiated.
            </Text>
            <Text align="left" as="i">
              Please note that 1 block is around 13 seconds on Ethereum. 2.5m
              blocks roughly equals to 1 year.
            </Text>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={() => {
                  console.log(recipient, duration);
                  deployContract.write();
                }}
              >
                Deploy Recovery Contract
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already deployed a recovery contract? Give token allowance to
                the recovery contract using the 'Allowance' page.
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
