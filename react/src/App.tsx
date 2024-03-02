import { useState, useEffect } from 'react'
import { MetaMaskButton } from "@metamask/sdk-react-ui";
// import { useSDK } from '@metamask/sdk-react-ui'
import { ethers } from 'ethers'
import { InteractionForm } from "./InteractionForm";
import './App.css'
import PeerReviewAbi from '../../abi/PeerReview.json'
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";


interface IInputField {
  name: string;
  value: string;
  description: string;
}

function App() {
  const [thisContractAddress, setThisContractAddress] = useState("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  // const provider = new ethers.BrowserProvider(window.ethereum);
  // const signer = provider.getSigner();
  // const address = signer.getAddress();
  // const network = provider.getNetwork();
  // const chainId = network.chainId;
  // const sdkConf = chainId === 59144 ? VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND : VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND;
  // const veraxSdk = new VeraxSdk(sdkConf, address);
  const sdkConf = VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND;
  const veraxSdk = new VeraxSdk(sdkConf, "0x5873298b68497fad590f68221D9a8d134902DE64");

  const [transactionId, setTransactionId] = useState('');
  const getTransactionDetails = async () => {
    if (!transactionId) {
      alert('Please enter a transaction ID');
      return;
    }
    const url = `https://admin-api.phosphor.xyz/v1/transactions/${transactionId}`;
    const apiKey = "9be29dde5932444fb00536722827a414";
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Phosphor-Api-Key': `${apiKey}`
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Fetched transaction details:', result);
    } catch (error) {
      console.error('Failed to fetch transaction details:', error);
    }
  };


  const fetchCollections = async () => {
    const url = 'https://admin-api.phosphor.xyz/v1/collections';
    const apiKey = "9be29dde5932444fb00536722827a414";
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Phosphor-Api-Key': `${apiKey}` // Using the API key
          // Add any required headers here
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Fetched collections:', result);
      // Handle success
    } catch (error) {
      console.error('Failed to fetch collections:', error);
      // Handle error
    }
  };
  const getMintRequest = async () => {
    const url = 'https://admin-api.phosphor.xyz/v1/mint-requests';
    const apiKey = "9be29dde5932444fb00536722827a414";
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Phosphor-Api-Key': `${apiKey}` // Using the API key
          // Add any required headers here
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Fetched collections:', result);
      // Handle success
    } catch (error) {
      console.error('Failed to fetch collections:', error);
      // Handle error
    }
  };
  const [collectionName, setCollectionName] = useState('');
  const [collectionSymbol, setCollectionSymbol] = useState('');

  const createCollection = async () => {
    if (!collectionName || !collectionSymbol) {
      alert('Please provide both name and symbol');
      return;
    }
    const url = 'https://admin-api.phosphor.xyz/v1/collections';
    // const apiKey = import.meta.env.VITE_API_KEY; // Accessing the API key from .env
    const apiKey = "9be29dde5932444fb00536722827a414";

    const data = {
      "name": collectionName,
      "default_item_type_id": null,
      "image_url": null,
      "reveal_strategy": "INSTANT",
      "preview_metadata": null,
      "editable_metadata": false,
      "deployment_request": {
        "type": "PLATFORM",
        "token_id_assignment_strategy": "AUTOMATIC",
        "platform": {
          "symbol": collectionSymbol,
          "variant": "FlexibleERC721"
          // "owner": "0x5873298b68497fad590f68221D9a8d134902DE64",

        },
        "network_id": 59140
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Phosphor-Api-Key': `${apiKey}` // Using the API key
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

  const createItem = async () => {
    const url = 'https://admin-api.phosphor.xyz/v1/items';
    // const apiKey = import.meta.env.VITE_API_KEY; // Accessing the API key from .env
    const apiKey = "9be29dde5932444fb00536722827a414";
    const data = {
      "collection_id": "42b6b890-e326-4980-b42d-a6f4c895014c",
      "attributes": {
        "title": "item-title",
        "description": "item-description",
        "image_url": "https://en.wikipedia.org/wiki/Main_Page#/media/File:King-Edward-VII_(cropped).jpg",
      },
      "item_type_id": null,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Phosphor-Api-Key': `${apiKey}` // Using the API key
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


  const lockItem = async () => {
    const url = 'https://admin-api.phosphor.xyz/v1/items/lock';
    // const apiKey = import.meta.env.VITE_API_KEY; // Accessing the API key from .env
    const apiKey = "9be29dde5932444fb00536722827a414";
    const data = {
      "collection_id": "42b6b890-e326-4980-b42d-a6f4c895014c"
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Phosphor-Api-Key': `${apiKey}` // Using the API key
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

  const mintRequest = async () => {
    const url = 'https://admin-api.phosphor.xyz/v1/mint-requests';
    // const apiKey = import.meta.env.VITE_API_KEY; // Accessing the API key from .env
    const apiKey = "9be29dde5932444fb00536722827a414";
    const data = {
      "quantity": "1",
      "to_address": "0x5873298b68497fad590f68221D9a8d134902DE64",
      // "collection_id": "42b6b890-e326-4980-b42d-a6f4c895014c"
      "item_id": "4e8bddc3-1b7e-4c4c-aeea-d99b625ac7b4"
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Phosphor-Api-Key': `${apiKey}` // Using the API key
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
      <div>
        <div>
          <input
            type="text"
            placeholder="Collection Name"
            onChange={(e) => setCollectionName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Symbol"
            onChange={(e) => setCollectionSymbol(e.target.value)}
          />
          <button onClick={() => createCollection()}>Create Collection</button>
        </div>
        <button onClick={fetchCollections}>Fetch Collection</button>
        <button onClick={createItem}>create item</button>
        <button onClick={lockItem}>lock item</button>
        <button onClick={mintRequest}>mint item</button>
        <div>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter Transaction ID"
          />
          <button onClick={getTransactionDetails}>Get Transaction Details</button>
        </div>
        <button onClick={getMintRequest}>get mint request</button>
      </div>
      {/* <InteractionForm */}
      {/*   description="Check if Submission is Approved" */}
      {/*   defaultInputs={[{ name: "tokenId", value: "0", description: "tokenId" }]} */}
      {/*   contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => { */}
      {/*     const contract = new ethers.Contract("0x27d73839Cc465Cc3Bd380362b4013FE7c184690D", PeerReviewAbi, signer); */}
      {/*     return contract.getIsApproved(inputObject.value); */}
      {/*   }} */}
      {/*   isReadCall={true} */}
      {/* /> */}

      <button onClick={async () => {
        const SCHEMA = '(bool hasCompletedTutoriall)';
        try {
          const txHash = await veraxSdk.schema.create(
            "Tutorial Schema 34327",
            "This Schema is used for thee tutorial",
            "https://ver.ax/#/tutorials1",
            SCHEMA,
          );
          console.log('Transaction Hash:', txHash);
        } catch (error) {
          console.error('Error creating schema:', error);
        }
      }}>Create Tutorial Schema</button>
      Follow @kirill_igum
    </>
  )
}
export default App
