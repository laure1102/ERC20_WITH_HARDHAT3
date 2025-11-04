import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import {DeployHuahuaContract} from "./DeployHuahuaContract.js";

export default buildModule("DeploySepoliaGroup", (m)=>{
    const {huahuaContract} = m.useModule(DeployHuahuaContract); 
    return {huahuaContract};
});