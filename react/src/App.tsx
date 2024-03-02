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
  const [thisContractAddress, setThisContractAddress] = useState("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const createCollection = async () => {
    const url = 'https://admin-api.phosphor.xyz/v1/collections';
    const apiKey = import.meta.env.VITE_API_KEY; // Accessing the API key from .env

    const data = {
      "name": "Collection ABC",
      "default_item_type_id": null,
      "image_url": null,
      "reveal_strategy": "INSTANT",
      "preview_metadata": null,
      "editable_metadata": false,
      "deployment_request": {
        "type": "PLATFORM",
        "token_id_assignment_strategy": "AUTOMATIC",
        "platform": {
          "symbol": "ABC",
          "variant": "FlexibleERC721"
        },
        "network_id": 59140
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}` // Using the API key
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Collection created:', result);
      // Handle success
    } catch (error) {
      console.error('Failed to create collection:', error);
      // Handle error
    }
  };


  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
        <div>
          <label htmlFor="contractAddress">Contract Address:</label>
          <input
            id="contractAddress"
            type="text"
            value={thisContractAddress}
            onChange={(e) => setThisContractAddress(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
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
        description="Add Keyword to Reviewer"
        defaultInputs={[
          { name: "reviewerIndex", value: "0", description: "Reviewer Index" },
          { name: "newKeyword", value: "", description: "New Keyword" }
        ]}
        contractFunction={(signer: ethers.Signer, inputObject1: IInputField, inputObject2: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.addKeywordToReviewer(inputObject1.value, inputObject2.value);
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
        description="Get Reviewer Keywords"
        defaultInputs={[{ name: "reviewerAddress", value: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", description: "Reviewer Address" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.getReviewerKeywords(inputObject.value);
        }}
        isReadCall={true}
      />
      <InteractionForm
        description="Submit Data"
        defaultInputs={[{ name: "data", value: "write some really clever text in the form of instruction and response.", description: "Data to submit" }]}
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
          return {
            author: result.author,
            data: result.data,
            selectedReviewers: result.selectedReviewers,
            shuffledReviewers: result.shuffledReviewers,
            isApproved: result.isApproved,
            seed: result.seed.toString(),
            countVotes: result.countVotes.toString()
          };
        }}
        isReadCall={true}
      />
      <InteractionForm
        description="Assign Random Seed to Submission"
        defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.assignRandomSeedToSubmission(inputObject.value);
        }}
      />
      <InteractionForm
        description="Shuffle Reviewers"
        defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.shuffleReviewers(inputObject.value);
        }}
      />
      <InteractionForm
        description="Get Shuffled Reviewers"
        defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.getShuffledReviewers(inputObject.value);
        }}
        isReadCall={true}
      />
      <InteractionForm
        description="Find Top Reviewers for Submission"
        defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.findTopReviewersForSubmission(inputObject.value);
        }}
      />
      <InteractionForm
        description="Get Selected Reviewers"
        defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.getSelectedReviewers(inputObject.value);
        }}
        isReadCall={true}
      />
      <InteractionForm
        description="Reviewer Vote"
        defaultInputs={[
          { name: "submissionId", value: "0", description: "Submission ID" },
          { name: "vote", value: "1", description: "Vote (1 for accept, 0 for reject)" }
        ]}
        contractFunction={async (signer: ethers.Signer, inputObject1: IInputField, inputObject2: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.reviewerVote(inputObject2.value, inputObject1.value);
        }}
      />
      <InteractionForm
        description="Reveal Votes"
        defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.revealVotes(inputObject.value);
        }}
      />
      <InteractionForm
        description="Check if Submission is Approved"
        defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.getIsApproved(inputObject.value);
        }}
        isReadCall={true}
      />
      <button onClick={createCollection}>Create Collection</button>

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
