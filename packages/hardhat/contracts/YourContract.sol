//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {

    struct Voter {
       uint weight;
       bool voted;
       uint vote;
   }
   struct Proposal {
       bytes32 name;
       uint voteCount;
   }

   bool public votingCompleted;
   address public chairperson;
   mapping(address => Voter) public voters;
   Proposal[] public proposals;

    modifier votingIsActive() {
        require(!votingCompleted, "Voting completed.");
        _;
    }

       constructor(bytes32[] memory proposalNames) {
       chairperson = msg.sender;
       voters[chairperson].weight = 1;
       for (uint i = 0; i < proposalNames.length; i++) {
           proposals.push(Proposal({
               name: proposalNames[i],
               voteCount: 0
           }));
       }
   }




  

 


    /**
     * Function that allows the owner to withdraw all the Ether in the contract
     * The function can only be called by the owner of the contract as defined by the isOwner modifier
     */
   // function withdraw() public isOwner {
   //     (bool success, ) = owner.call{ value: address(this).balance }("");
  //      require(success, "Failed to send Ether");
 //   

 function giveRightToVote(address voter) external votingIsActive {
       require(
           msg.sender == chairperson,
           "Only chairperson can give right to vote."
       );
       require(
           !voters[voter].voted,
           "The voter already voted."
       );
       require(voters[voter].weight == 0);
       voters[voter].weight = 1;
   }

   function vote(uint proposal) external votingIsActive {
       Voter storage sender = voters[msg.sender];
       require(sender.weight != 0, "Has no right to vote");
       require(!sender.voted, "Already voted.");
       sender.voted = true;
       sender.vote = proposal;
       proposals[proposal].voteCount += sender.weight;
   }

   function endVoting() external votingIsActive {
        require(msg.sender == chairperson, "Only chairperson can end the voting");
        votingCompleted = true; 
    }

    function winningProposal() public view returns (uint winningProposal_){
       uint winningVoteCount = 0;
       for (uint p = 0; p < proposals.length; p++) {
           if (proposals[p].voteCount > winningVoteCount) {
               winningVoteCount = proposals[p].voteCount;
               winningProposal_ = p;
           }
       }
   }


   function winnerName() external view returns (bytes32 winnerName_){
       winnerName_ = proposals[winningProposal()].name;
   }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
