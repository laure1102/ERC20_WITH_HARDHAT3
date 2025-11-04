import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export const DeployHuahuaContract = buildModule("HuahuaContract", (m) => {
  const huahuaContract = m.contract("HuahuaContract", [2n* (10n**18n)]);

  return { huahuaContract };
});
