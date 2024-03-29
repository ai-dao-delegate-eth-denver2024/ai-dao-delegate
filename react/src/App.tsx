import { useState } from 'react'
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
  const [activeTab, setActiveTab] = useState('owner');
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [collectionResult, setCollectionResult] = useState(null);
  const [collectionId, setCollectionId] = useState('');
  const [showCollectionResult, setShowCollectionResult] = useState(false);
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
      console.log('Item created:', result);
      setItemResult({ title, description, imageUrl }); // Update the itemResult state with the submitted item details
      setCollectionResult(result);
      setCollectionId(result.id);
      // setShowCollectionResult(true); // Automatically show the result upon creation
      // Handle success
    } catch (error) {
      console.error('Failed to create collection:', error);
      // Handle error
    }
  };

  const [itemResult, setItemResult] = useState({ title: '', description: '', imageUrl: '' });

  const createItemWithDetails = async (collectionId, title, description, imageUrl) => {
    setItemResult({ title, description, imageUrl });
    const url = 'https://admin-api.phosphor.xyz/v1/items';
    // const apiKey = import.meta.env.VITE_API_KEY; // Accessing the API key from .env
    const apiKey = "9be29dde5932444fb00536722827a414";
    const data = {
      "collection_id": collectionId,
      "attributes": {
        "title": title,
        "description": description,
        "image_url": imageUrl,
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
      console.log('Item locked:', result);
      setLockItemResult(result); // Store the lock item result
      // Handle success
    } catch (error) {
      console.error('Failed to create collection:', error);
      // Handle error
    }
  };


  const [lockCollectionId, setLockCollectionId] = useState('');
  const [lockItemResult, setLockItemResult] = useState(null);
  const [showLockItemResult, setShowLockItemResult] = useState(false);
  const lockItem = async (collectionId) => {
    const url = 'https://admin-api.phosphor.xyz/v1/items/lock';
    // const apiKey = import.meta.env.VITE_API_KEY; // Accessing the API key from .env
    const apiKey = "9be29dde5932444fb00536722827a414";
    const data = {
      "collection_id": collectionId
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
      console.log('Mint request submitted:', result);
      setMintResult(result); // Store the mint result
      // Handle success
    } catch (error) {
      console.error('Failed to create collection:', error);
      // Handle error
    }
  };

  const [toAddress, setToAddress] = useState('');
  const [itemId, setItemId] = useState('');
  const [mintResult, setMintResult] = useState(null);
  const [showMintResult, setShowMintResult] = useState(false);
  const [showMintNFTSection, setShowMintNFTSection] = useState(false);
  const [showOnChainSection, setShowOnChainSection] = useState(false);

  const mintRequest = async (toAddress, itemId) => {
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

      <div>
        <button onClick={() => setActiveTab('owner')}>Owner</button>
        <button onClick={() => setActiveTab('author')}>Author</button>
        <button onClick={() => setActiveTab('reviewers')}>Reviewers</button>
      </div>
      {activeTab === 'owner' && (
        <>
          <InteractionForm
            description="add author"
            defaultInputs={[{ name: "author", value: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", description: "author" }]}
            contractFunction={(signer: ethers.Signer, inputObject: IInputField) => {
              const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
              return contract.addAuthor(inputObject.value);
            }}
          />
          <InteractionForm
            description="add reviewer"
            defaultInputs={[
              { name: "reviewer", value: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", description: "reviewer" },
              { name: "keywords", value: "dao", description: "keywords" }
            ]}
            contractFunction={(signer: ethers.Signer, inputObject1: IInputField, inputObject2: IInputField) => {
              const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
              const keywordsArray = inputObject2.value.split(',').map(keyword => keyword.trim());
              return contract.addReviewer(inputObject1.value, keywordsArray);
            }}
          />
        </>
      )}
      {activeTab === 'author' && (
        <>
          <InteractionForm
            description="Submit Data"
            defaultInputs={[{ name: "data", value: "write some really clever text in the form of instruction and response.", description: "Data to submit" }]}
            contractFunction={(signer: ethers.Signer, inputObject: IInputField) => {
              const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
              return contract.submitData(inputObject.value);
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
            <button onClick={() => setShowMintNFTSection(!showMintNFTSection)}>
              {showMintNFTSection ? 'Hide Mint NFT Section' : 'Show Mint NFT Section'}
            </button>
            {showMintNFTSection && (
              <>
                <h3>mint NFT</h3>
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
                <div>
                  <input
                    type="text"
                    placeholder="Collection ID"
                    onChange={(e) => setCollectionId(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <button onClick={() => createItemWithDetails(collectionId, title, description, imageUrl)}>Submit Item</button>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Collection ID"
                    onChange={(e) => setLockCollectionId(e.target.value)}
                  />
                  <button onClick={() => lockItem(lockCollectionId)}>Lock Item</button>
                  <button onClick={() => setShowLockItemResult(!showLockItemResult)}>
                    {showLockItemResult ? 'Hide Lock Item Result' : 'Show Lock Item Result'}
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="To Address"
                    onChange={(e) => setToAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Item ID"
                    onChange={(e) => setItemId(e.target.value)}
                  />
                  <button onClick={() => mintRequest(toAddress, itemId)}>Submit Mint Request</button>
                </div>
                <button onClick={() => setShowMintResult(!showMintResult)}>
                  {showMintResult ? 'Hide Mint Result' : 'Show Mint Result'}
                </button>
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
                <button onClick={() => setShowCollectionResult(!showCollectionResult)}>
                  {showCollectionResult ? 'Hide' : 'Show'} Collection Result
                </button>
                {showCollectionResult && collectionResult && (
                  <div>
                    <h3>Collection Creation Result:</h3>
                    <h4>Collection ID: {collectionResult.id}</h4>
                    <pre>{JSON.stringify(collectionResult, null, 2)}</pre>
                  </div>
                )}
                {showLockItemResult && lockItemResult && (
                  <div>
                    <h3>Lock Item Result:</h3>
                    <pre>{JSON.stringify(lockItemResult, null, 2)}</pre>
                  </div>
                )}
                {showMintResult && mintResult && (
                  <div>
                    <h3>Mint Result:</h3>
                    <pre>{JSON.stringify(mintResult, null, 2)}</pre>
                  </div>
                )}
                {itemResult.imageUrl && itemResult.description && (
                  <div>
                    <h3>Submitted Item Details:</h3>
                    <p>Title: {itemResult.title}</p>
                    <p>Description: {itemResult.description}</p>
                    <img src={itemResult.imageUrl} alt="Submitted Item" style={{ maxWidth: '200px' }} />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
      {activeTab === 'reviewers' && (
        <>
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
        </>
      )}
      <br />
      <h3>Peer review steps</h3>
      <p>anyone can do these steps</p>
      <InteractionForm
        description="Assign Random Seed"
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
        description="Find Top Reviewers"
        defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
        contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
          const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
          return contract.findTopReviewersForSubmission(inputObject.value);
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

      <br />

      <button onClick={() => setShowOnChainSection(!showOnChainSection)}>
        {showOnChainSection ? 'Hide On-Chain Section' : 'See What is On-Chain'}
      </button>
      {showOnChainSection && (
        <>
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
            description="Get Shuffled Reviewers"
            defaultInputs={[{ name: "submissionId", value: "0", description: "Submission ID" }]}
            contractFunction={async (signer: ethers.Signer, inputObject: IInputField) => {
              const contract = new ethers.Contract(thisContractAddress, PeerReviewAbi, signer);
              return contract.getShuffledReviewers(inputObject.value);
            }}
            isReadCall={true}
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
        </>
      )}
      <br />

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
      <br />
      Follow @kirill_igum
    </>
  )
}
export default App
