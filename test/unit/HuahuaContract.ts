import assert from "node:assert/strict";
import { describe, it ,beforeEach} from "node:test";

import { network } from "hardhat";
import { parseUnits } from "viem";

describe("HuahuContract unit test", async()=>{
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();

    let huahuaContract;
    beforeEach(async ()=>{
        let initSupply:bigint = parseUnits("2",18);
        huahuaContract = await viem.deployContract("HuahuaContract",
            [initSupply]
        );
    });

    it("demo test", async()=>{
        assert.equal(1,1,"1!=1");
    });
});