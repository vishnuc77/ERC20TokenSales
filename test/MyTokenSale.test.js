const TokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");
const KycContract = artifacts.require("KycContract");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("TokenSale Test", async accounts => {
    const [ initialHolder, recipient, anotherAccount ] = accounts;

    it("There shouldn't be any coins in my account", async () => {
        let instance = await Token.deployed();
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("All coins should be in the tokensale smart contract", async () => {
        let instance = await Token.deployed();
        let balance = await instance.balanceOf.call(TokenSale.address);
        let totalSupply = await instance.totalSupply.call();
        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

    it("Should be possible to buy one token", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let KycContractInstance = await KycContract.deployed();
        await KycContractInstance.setKycCompleted(recipient);
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);
        await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        return expect(await tokenInstance.balanceOf.call(recipient)).to.be.a.bignumber.equal(balanceBeforeAccount + 1);
    })
});