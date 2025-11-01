// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
 

contract HuahuaContract is ERC20, Ownable {
    constructor(uint256 initSupply)
        ERC20("HUAHUA", "HUA")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
