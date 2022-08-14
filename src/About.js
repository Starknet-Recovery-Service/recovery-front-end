import React from "react";
import { HStack, Box, Button, Text } from "@chakra-ui/react";

export default function About() {
  const addTicker = async (ticker) => {
    let tokenAddress;
    const tokenSymbol = ticker;

    if (ticker === "USDC") {
      tokenAddress = "0xf3D16db53cFCee5d26EE29cDeeaa49215A21d345";
    } else if (ticker === "WETH") {
      tokenAddress = "0x5E4921e55D88f1E61AcD35adE5cAfce3F3FcA7a6";
    } else if (ticker === "UNI") {
      tokenAddress = "0x3E1722c57f5439b5279bA7Bd9Db37f667eAF2Bc9";
    }

    const tokenDecimals = 18;
    const tokenImage = "";

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Box mt="5">
        <Text>USDC: 0xf3D16db53cFCee5d26EE29cDeeaa49215A21d345</Text>
        <Text>UNI: 0x3E1722c57f5439b5279bA7Bd9Db37f667eAF2Bc9</Text>
        <Text>WETH: 0x5E4921e55D88f1E61AcD35adE5cAfce3F3FcA7a6</Text>
      </Box>
      <Text mt="5">Click to import tokens to your Metamask:</Text>
      <HStack justifyContent="center" mt="5">
        <Button onClick={() => addTicker("USDC")}>Add Fake USDC Ticker</Button>
        <Button onClick={() => addTicker("UNI")}>Add Fake UNI Ticker</Button>
        <Button onClick={() => addTicker("WETH")}>Add Fake WETH Ticker</Button>
      </HStack>
    </div>
  );
}
