import assert from "node:assert/strict";
import { describe, it ,beforeEach} from "node:test";

import { network } from "hardhat";
import { parseUnits } from "viem";

import {DeployHuahuaContract} from '../../ignition/modules/DeployHuahuaContract.js';
import { parse } from "node:path";

describe("HuahuContract unit test", async()=>{
    const { viem, ignition } = await network.connect("sepolia"); //或者命令行 --network sepolia
    const publicClient = await viem.getPublicClient();
    //注意 test 的keystore用的是dev，所以相关keystore需要存一份到dev中，dev的keystore查看和使用时，不需要设置密码
    let huahuaContract:any;
    let wallet1:any;
    let wallet2:any;
    beforeEach(async ()=>{
        const deployment = await ignition.deploy(DeployHuahuaContract);
        huahuaContract = deployment.huahuaContract;
        console.log(`huahuaContract address:${huahuaContract.address}`);
        const [w1,w2] = await viem.getWalletClients();
        wallet1 = w1;
        wallet2 = w2;
    });

    it("sepolia test the token name", async ()=>{
        const tokenName = await huahuaContract.read.name();
        assert.equal(tokenName, "HUAHUA", "token name is incorrect!");
    });

    it("sepolia test mint tokens to walllet1", async()=>{
        console.log(`wallet2.account.address:${wallet2.account.address}`);
        const hash = await huahuaContract.write.mint([wallet2.account.address, parseUnits("3",18)]);
        const transaction = await publicClient.waitForTransactionReceipt(
            { 
                confirmations: 5, //等待5个区块确认
                hash: hash
            }
        );
        const w2Balance = await huahuaContract.read.balanceOf([wallet2.account.address]);
        assert.equal(w2Balance, parseUnits("12",18),"wallet2's balance is incorrect after mint 3 tokens");
    });
});