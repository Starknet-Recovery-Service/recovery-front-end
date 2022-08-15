import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useStarknet, useConnectors } from "@starknet-react/core";
import StarkConnect from "./StarkConnect";

import Identicon from "identicon.js";

const Links = ["Deployment", "Allowance", "Recovery", "Claim", "About"];

const NavLink = ({ children, setPage }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
    onClick={() => {
      console.log(children);
      setPage(children.toLowerCase());
    }}
  >
    {children}
  </Link>
);

export default function Simple({ setPage }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} px="24">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box fontWeight="bold">Starknet Recovery</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link} setPage={setPage}>
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <Button mr={4} onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              {address ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    {
                      <Avatar
                        src={`data:image/png;base64,${new Identicon(
                          address,
                          420
                        ).toString()}`}
                        size={"sm"}
                        mr="5"
                      />
                    }
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Profile</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => disconnect()}>Disconnect</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button onClick={() => connect()} mr="5" colorScheme="green">
                  Connect Metamask
                </Button>
              )}
              <StarkConnect />
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink setPage={setPage} key={link}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
