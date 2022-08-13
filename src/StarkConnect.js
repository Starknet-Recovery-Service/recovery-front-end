import { useStarknet, useConnectors } from "@starknet-react/core";
import { Button, Flex, HStack } from "@chakra-ui/react";

export default function ConnectWallet() {
  const { account } = useStarknet();
  const { available, connect, disconnect } = useConnectors();

  if (account) {
    return (
      <HStack spacing={4}>
        <Button size="md">Account: {account.substring(0, 7) + "..."}</Button>
        <Button size="md" onClick={() => disconnect()} colorScheme="red">
          Disconnect
        </Button>
      </HStack>
    );
  }

  console.log(available);

  return (
    <Flex>
      {available.map((connector) => (
        <Button
          key={connector.id()}
          onClick={() => connect(connector)}
          colorScheme="orange"
        >
          {`Connect ${connector.name()}`}
        </Button>
      ))}
    </Flex>
  );
}
