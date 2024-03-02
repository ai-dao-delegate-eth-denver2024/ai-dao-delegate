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
  const thisContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  return (
    <>
      <div>
        <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
      </div>
      <h1>peer tunning AI</h1>

      <InteractionForm
        description="add author"
        defaultInputs={[{ name: "author", value: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", description: "author" }]}
        contractFunction={(signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.addAuthor(inputObject.value);
        }}
      />
      <InteractionForm
        description="Get Authors"
        defaultInputs={[]}
        contractFunction={async (signer: ethers.Signer) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.getAuthors();
        }}
        isReadCall={true}
      />

      <InteractionForm
        description="add reviewer"
        defaultInputs={[
          { name: "reviewer", value: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", description: "reviewer" },
          { name: "keywords", value: "dao", description: "keywords" }
        ]}
        contractFunction={(signer: ethers.Signer, inputObject1: IInputField, inputObject2: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          // Split the keywords string by comma to create an array, trimming whitespace from each keyword
          const keywordsArray = inputObject2.value.split(',').map(keyword => keyword.trim());
          return contract.addReviewer(inputObject1.value, keywordsArray);
        }}
      />
      <InteractionForm
        description="Get Reviewers"
        defaultInputs={[]}
        contractFunction={async (signer: ethers.Signer) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.getReviewers();
        }}
        isReadCall={true}
      />
      <InteractionForm
        description="Submit Data"
        defaultInputs={[{ name: "data", value: "", description: "Data to submit" }]}
        contractFunction={(signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.submitData(inputObject.value);
        }}
      />
      <InteractionForm
        description="Get Submission"
        defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          const submissionId = inputObject.value;
          const result = await contract.getSubmission(submissionId);
          return JSON.stringify({
            author: result.author,
            data: result.data,
            selectedReviewers: result.selectedReviewers,
            shuffledReviewers: result.shuffledReviewers,
            isApproved: result.isApproved,
            seed: result.seed.toString(),
            countVotes: result.countVotes.toString()
          }, null, 2);
        }}
        isReadCall={true}
      />
      Follow @kirill_igum
    </>
  )
}
export default App

/*
      <InteractionForm
        description="Announce Prompt Response"
        defaultInputs={[
          { name: 'conversationId', value: "0", description: 'Conversation ID' },
          { name: 'iResponse', value: "0", description: 'Response Index' },
          { name: 'iSplitResponse', value: "0", description: 'Split Response Index' },
          { name: 'splitResponse', value: "", description: 'Split Response' }
        ]}
        contractFunction={(signer: ethers.Signer, inputObject1: IInputField, inputObject2: IInputField, inputObject3: IInputField, inputObject4: IInputField) => {
          const contract = new ethers.Contract(contractAddress, TrustAndTeachABI, signer);
          const conversationId = ethers.BigNumber.from(inputObject1.value);
          const iResponse = ethers.BigNumber.from(inputObject2.value);
          const iSplitResponse = ethers.BigNumber.from(inputObject3.value);
          return contract.announcePromptResponse(conversationId, iResponse, iSplitResponse, inputObject4.value);
        }}
      />
      <InteractionForm
        description="Get Conversation by ID"
        defaultInputs={[{ name: 'conversationId', value: "0", description: 'Conversation ID' }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(contractAddress, TrustAndTeachABI, signer);
          const result = await contract.getConversationById(ethers.BigNumber.from(inputObject.value));
          return {
            author: result.author,
            prompt: result.prompt,
            responses: result.responses,
            rankSubmissionCount: result.rankSubmissionCount.toNumber(),
            usersWhoSubmittedRanks: result.usersWhoSubmittedRanks.map(ethers.utils.getAddress),
            createInstructionTimestamp: new Date(result.createInstructionTimestamp.toNumber() * 1000).toISOString(),
            responseAnnouncedTimestamp: new Date(result.responseAnnouncedTimestamp.toNumber() * 1000).toISOString()
          };
        }}
        isReadCall={true}
      />
*/
