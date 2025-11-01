// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library StringUtils{
    function equal(string memory str1, string memory str2) public pure returns(bool){
        return keccak256(bytes(str1)) == keccak256(bytes(str2));
    }
}