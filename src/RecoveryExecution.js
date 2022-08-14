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
  const [showPassword, setShowPassword] = useState(false);

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
            <FormControl id="EOA-address" isRequired>
              <FormLabel>Wallet address</FormLabel>
              <Input type="text" placeholder="0x...abc" />
            </FormControl>
            <Button>Check Activity</Button>
            <Text>Last Activity on: 08/14/2022 10:30pt</Text>
            <Text>Eligible for recovery</Text>
            <Text>Recipient: 0x....</Text>
            <Stack spacing={10} pt={2}>
              <Button>Call Fossil Api</Button>
              <Button>Execute recovery on L2</Button>
              <Button>Consume message on L1</Button>
              <Text>Available Assets</Text>
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
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Claim Assets
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
