import { useState, useEffect } from 'react'
import { MetaMaskButton } from "@metamask/sdk-react-ui";
// import { useSDK } from '@metamask/sdk-react-ui'
import { ethers } from 'ethers'
import { InteractionForm } from "./InteractionForm";
import './App.css'
import PeerReviewAbi from '../../abi/PeerReview.json'

interface IInputField {
  name: string;
  value: string;
  description: string;
}

function App() {

  return (
    <>
      <div>
        <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
      </div>
      <h1>AI DAO Delegate</h1>

      <InteractionForm
        description="add author"
        defaultInputs={[{ name: "author", value: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", description: "author" }]}
        contractFunction={(signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", PeerReviewAbi, signer);
          return contract.addAuthor(inputObject.value);
        }}
      />
      <InteractionForm
        description="Get Authors"
        defaultInputs={[]}
        contractFunction={async (signer: ethers.Signer) => {
          const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", PeerReviewAbi, signer);
          return contract.getAuthors();
        }}
        isReadCall={true}
      />
    </>
  )
}

export default App
