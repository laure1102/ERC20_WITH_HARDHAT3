import assert from "node:assert/strict";
import { describe, it ,beforeEach} from "node:test";

import { network } from "hardhat";
import { parseUnits } from "viem";

describe("HuahuContract unit test", async()=>{
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();
    const initSupply:bigint = parseUnits("2", 18);
    let alice:any;
    let bob:any;
    let defaultAddr = "";
    let ctt:any;
    beforeEach(async ()=>{
        const [wallet1,wallet2,wallet3] = await viem.getWalletClients();
        defaultAddr = wallet1.account.address;
        alice = wallet2;
        bob = wallet3;
        ctt = await viem.deployContract("HuahuaContract",
            [initSupply],
            // {
            //     client: {
            //         wallet: defaultAddr,//默认使用hardhat配置的第一个账户部署，这里也可以进行替换。
            //     },
            // }
        );
    });

    it("test the token name", async()=>{
        assert.equal(`${await ctt.read.name()}|${await ctt.read.symbol()}`,"HUAHUA|HUA","token name is incorrect!");
    });

    it("test the initSupply", async ()=>{
        assert.equal(await ctt.read.balanceOf([defaultAddr]),initSupply,"the balanceOf the initSupply is incorrect!");
    });

    it("test alice mint", async()=>{
        const targetTokens = parseUnits("0.5",18);
        await ctt.write.mint([alice.account.address,targetTokens]);
        const aliceBalance = await ctt.read.balanceOf([alice.account.address]);
        assert.equal(aliceBalance, targetTokens, "test alice mint: balance is incorrect!");
    });

    it("test bob mint", async()=>{
        const targetTokens = parseUnits("0.6",18);
        await ctt.write.mint([bob.account.address,targetTokens]);
        const bobBalance = await ctt.read.balanceOf([bob.account.address]);
        assert.equal(bobBalance, targetTokens, "test bob mint: balance is incorrect!");
    });

    it("test transfer from owner", async()=>{
        //为自己筑造10个
        await ctt.write.mint([defaultAddr, parseUnits("10",18)]);
        //转移给alice 5个
        await ctt.write.transfer([alice.account.address, parseUnits("5", 18)]);
        const aliceBalance = await ctt.read.balanceOf([alice.account.address]);
        const ownerBalance = await ctt.read.balanceOf([defaultAddr]);
        assert.equal(aliceBalance, parseUnits("5", 18), "after transfer , alice's balance is incorrect!");
        assert.equal(ownerBalance, parseUnits("7", 18), "after transfer , owner's balance is incorrect!");
    });

    it("test total supply", async()=>{
        await ctt.write.mint([bob.account.address, parseUnits("3",18)]);
        await ctt.write.mint([alice.account.address, parseUnits("4",18)]);
        const totalSupply = await ctt.read.totalSupply();
        assert.equal(totalSupply, parseUnits("9",18), "the total supply is incorrect!");
    });

    it("test tranfer from user", async()=>{
        //给alice筑造10个token
        await ctt.write.mint([alice.account.address, parseUnits("10",18)]);
        //模拟alice授权给合约地址5个token
        await ctt.write.approve([defaultAddr, parseUnits("5",18)],
            {
                account: alice.account// 加参数表示每次调用用谁的地址
            }
        );
        //npx hardhat node 可以查看hardhat内置的账户
        const aliceAllowance = await ctt.read.allowance([alice.account.address,defaultAddr]);//查询alice授权给defaultAddr的余额
        console.log(`alice allow defaultAddr to transfer, allowance:${aliceAllowance}`);
        assert.equal(aliceAllowance, parseUnits("5",18), "before transfer , alice allowance is incorrect!");

        await ctt.write.transferFrom([alice.account.address,bob.account.address, parseUnits("3",18)]);//转3个，没传walletClient，用的defaultAddr合约地址
        const bobBalance = await ctt.read.balanceOf([bob.account.address]);
        assert.equal(bobBalance, parseUnits("3",18), "after transfer , bob's balance is incorrect!");
        const aliceBalance = await ctt.read.balanceOf([alice.account.address]);
        assert.equal(aliceBalance, parseUnits("7",18), "after transfer , alice's balance is incorrect!");
    });
});