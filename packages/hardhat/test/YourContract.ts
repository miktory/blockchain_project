import { expect } from "chai";
import { ethers } from "hardhat";

describe("YourContract", function () {
    let yourContract: YourContract;
    let addr1;
    let addr2;
    let owner;
    const proposalNames = ["0x6669727374000000000000000000000000000000000000000000000000000000", "0x7365636f6e640000000000000000000000000000000000000000000000000000", "0x7468697264000000000000000000000000000000000000000000000000000000"];

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners(); 
        const yourContractFactory = await ethers.getContractFactory("YourContract");
        yourContract = await yourContractFactory.deploy(proposalNames); 
    });


    describe("Vote", function () {
        it("A user can't vote unless he/she has been granted voting rights.", async function () {
            await expect(yourContract.connect(addr1).vote(1)).to.be.revertedWith("Has no right to vote");
        });

        it("User can vote only when voting is active", async function () {
            await yourContract.giveRightToVote(addr1);
            await yourContract.connect(addr1).vote(0);
            await yourContract.endVoting();
            await expect(yourContract.connect(addr2).vote(1)).to.be.revertedWith("Voting completed.");
        });

        it("Any user can vote only once", async function () {
            await yourContract.giveRightToVote(addr1); 
            await yourContract.connect(addr1).vote(0);
            await expect(yourContract.connect(addr1).vote(1)).to.be.revertedWith("Already voted.");
        });

    });

    describe("End voting", function () {

        it("Only chairperson can end voting", async function () {
            await expect(yourContract.connect(addr1).endVoting()).to.be.revertedWith("Only chairperson can end the voting");
        });

        it("Chairperson can't end voting if voting already ended.", async function () {
            await yourContract.connect(owner).endVoting();
            await expect(yourContract.connect(owner).endVoting()).to.be.revertedWith("Voting completed.");
        });
    });
});
