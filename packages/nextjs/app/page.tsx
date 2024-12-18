"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import deployedContracts from "../contracts/deployedContracts";
import "./styles.css";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    deployedContracts[31337].YourContract.address,
    deployedContracts[31337].YourContract.abi,
    provider.getSigner(),
  );
  const [selectedCommand, setSelectedCommand] = useState("");
  const [parametrized, setParametrized] = useState(false);
  const [selectedContractCommand, setContractCommand] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);

  const handleSelectChange = event => {
    const value = event.target.value;

    if (value === "chairperson") {
      setContractCommand(() => contract.chairperson);
      setParametrized(false);
    } else if (value === "winnerName") {
      setContractCommand(() => contract.winnerName);
      setParametrized(false);
    } else if (value === "proposals") {
      setContractCommand(() => contract.proposals);
      setParametrized(true);
    } else if (value === "votingCompleted") {
      setContractCommand(() => contract.votingCompleted);
      setParametrized(false);
    } else if (value === "endVoting") {
      setContractCommand(() => contract.endVoting);
      setParametrized(false);
    } else if (value === "vote") {
      setContractCommand(() => contract.vote);
      setParametrized(true);
    } else if (value === "giveRightToVote") {
      setContractCommand(() => contract.giveRightToVote);
      setParametrized(true);
    } else if (value === "winningProposal") {
      setContractCommand(() => contract.winningProposal);
      setParametrized(false);
    }
    setSelectedCommand(value);
  };

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const checkOwnership = async () => {
      if (!connectedAddress) return;
      try {
        const owner = await contract.chairperson();
        setIsOwner(owner.toLowerCase() === connectedAddress.toLowerCase());
      } catch {}
    };
    checkOwnership();
  }, [connectedAddress]);

  const fetchValue = async () => {
    if (!connectedAddress) {
      return;
    }
    console.log(selectedContractCommand);
    let result = null;
    try {
      if (parametrized) result = await selectedContractCommand(inputValue);
      else result = await selectedContractCommand();
      const parsed = JSON.stringify(result);
      setValue(parsed);
      console.log(result);
    } catch (error) {
      setValue(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <main className="min-h-screen " style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="rounded-rectangle-main">
          <div className="rounded-rectangle" style={{ height: "100%", width: "45%" }}>
            <div
              className={`rounded-rectangle ${isOwner ? "owner" : "not-owner"}`}
              style={{ height: "70px", width: "90%" }}
            >
              <h1 className="text">{isOwner ? "You are contract owner" : "You are not contract owner"} </h1>
            </div>
            <div
              className={`rounded-rectangle ${isOwner ? "owner" : "not-owner"}`}
              style={{ height: "140px", width: "90%" }}
            >
              <h1 className="text">Your address: {connectedAddress} </h1>
              <h1 className="text">Contract address: {contract.address} </h1>
            </div>
            <div
              className={`rounded-rectangle ${isOwner ? "owner" : "not-owner"}`}
              style={{ height: "100px", width: "90%" }}
            >
              <h1>Choose command:</h1>
              <select
                className={`rounded-rectangle ${isOwner ? "owner" : "not-owner"}`}
                onChange={handleSelectChange}
                value={selectedCommand}
                style={{
                  backgroundColor: "#000000",
                  width: "200px",
                  height: "35px",
                  flexDirection: "row",
                  textAlign: "center",
                }}
              >
                <option value="">-- Choose --</option>
                <option value="winnerName">winnerName</option>
                <option value="chairperson">chairperson</option>
                <option value="proposals">proposals</option>
                <option value="votingCompleted">votingCompleted</option>
                <option value="vote">vote</option>
                <option value="winningProposal">winningProposal</option>{" "}
                {isOwner && <option value="endVoting">endVoting</option>}{" "}
                {isOwner && <option value="giveRightToVote">giveRightToVote</option>}
              </select>
            </div>{" "}
            {parametrized !== false && selectedCommand !== "" && (
              <div
                className={`rounded-rectangle`}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "10%",
                  width: "90%",
                }}
              >
                <label className={"text"}>Parameters</label>
                <input
                  className={`rounded-rectangle`}
                  style={{
                    backgroundColor: "#000000",
                    height: "35px",
                    width: "200px",
                    flexDirection: "row",
                    textAlign: "center",
                  }}
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                />
              </div>
            )}{" "}
            {selectedCommand !== "" && (
              <button
                className="rounded-button"
                onClick={() => fetchValue()}
                style={{
                  height: "35px",
                  width: "200px",
                  flexDirection: "row",
                }}
              >
                {" "}
                Send{" "}
              </button>
            )}
          </div>
          <div className="rounded-rectangle" style={{ height: "100%", width: "45%" }}>
            <div
              className={`rounded-rectangle ${isOwner ? "owner" : "not-owner"}`}
              style={{ height: "70px", width: "90%" }}
            >
              <h1 className="text">Result</h1>
            </div>
            <div
              className={`rounded-rectangle ${isOwner ? "owner" : "not-owner"}`}
              style={{ height: "80%", width: "90%" }}
            >
              <label className="text" style={{ width: "90%", height: "80%" }}>
                {value}
              </label>
            </div>
          </div>
        </div>
      </main>
      undefined
    </>
  );
};

export default Home;
