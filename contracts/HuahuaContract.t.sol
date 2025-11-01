// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {HuahuaContract} from "./HuahuaContract.sol";
import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {StringUtils} from "./libs/Utils.sol";

contract HuahuaContractTest is Test{
    using StringUtils for string;

    HuahuaContract ctt;

    uint256 initSupply;
    address constant alice = 0x6981b209E782CB754dc3fEebfdC11eA66bD71f00;
    address constant bob = 0x9D58A338A60Ca1861dd54D994955cd7453ddf7A2;

    function setUp() public{
        _reDeploy();
    }

    function _reDeploy() internal{
        ctt = new HuahuaContract(initSupply);//初始化给owner创建2个token
        initSupply = 2 * (10 ** ctt.decimals());
    }

    function testTokenName() public view{
        string memory testStr = string.concat(ctt.name(),"|", ctt.symbol());
        require(testStr.equal("HUAHUA|HUA"),"token name is not correct!");
    }

    function testInitSupply() public {
        _reDeploy();
        address me = address(this);
        require(ctt.balanceOf(me) == initSupply, "init supply is not correct!");
    }

    function testMintAlice() public{
        _reDeploy();
        uint256 targetTokens = 5 * (10 ** (ctt.decimals() -1)); // 0.5 * (10 ** ctt.decimals())
        ctt.mint(alice, targetTokens);
        require(ctt.balanceOf(alice) == targetTokens, "balance is not correct after mint!");
    }

    function testMintBob() public{
        _reDeploy();
        uint256 targetTokens = 6 * (10 ** (ctt.decimals() -1)); // 0.6 * (10 ** ctt.decimals())
        ctt.mint(bob, targetTokens);
        require(ctt.balanceOf(bob) == targetTokens, "balance is not correct after mint!");
    }

    function testTransferFromOwner() public {
        _reDeploy(); //初始化了2个token
        address me = address(this);
        //为自己筑造10个
        ctt.mint(me, 10 * (10**ctt.decimals()));
        //转移给alice 5个
        ctt.transfer(alice, 5 * (10 ** ctt.decimals()));
        require(ctt.balanceOf(alice) == 5 * (10 ** ctt.decimals()), "after transfer ,alice's balance is not correct!");
    }

    function testTransferFrom() public {
        //test transfer to bob from alice
        _reDeploy();
        console.log("this address:");
        console.log(address(this));
        //为alice筑造10个token代币
        ctt.mint(alice, (10*(10**ctt.decimals())));
        //alice 把 4 个额度授权给本测试合约
        //prank是临时伪造msg.sender。vm.prank(alice)只影响接下来的一次调用，多次调用使用startPrank和stopPrank
        vm.startPrank(alice); //vm是Foundry 自带的作弊器，下一笔交易的发起者= alice
        ctt.approve(address(this), (4*(10**ctt.decimals()))); //msg.sender=alice approve本测试合约4个额度
        vm.stopPrank();
        uint256 allowanceAmount = ctt.allowance(alice, address(this));//查询alice授权给本测试合约地址的剩余额度
        console.log("allowance:", allowanceAmount);
        //转移4个给bob,测试合约代 alice 转 4 个给 bob
        ctt.transferFrom(alice, bob, (4*(10**ctt.decimals()))); //msg.sender= address(this)
        
        require(ctt.balanceOf(bob) == 4 * (10 ** ctt.decimals()), "after transfer ,bob's balance is not correct!");
    }

    function testTotalSupply() public{
        _reDeploy(); // init 2
        ctt.mint(alice, (5 * (10 ** ctt.decimals())));
        ctt.mint(bob, (4 * (10 ** ctt.decimals())));

        require(ctt.totalSupply() == (11 * (10 ** ctt.decimals())), "totalSupply is not correct after mint!");
    }
}