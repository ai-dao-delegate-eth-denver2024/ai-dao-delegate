# peer tunning ai

## contract deployed

### Linea Goerli:
uses Phosphor and Verax
### inco:
uses full homomorphic encryption for private voting
https://explorer.testnet.inco.org/address/0x70abFFA49E84860F06E91c7809D0D87B73166f25
### XDC:


## Deployment 

### front-end

```shell
cd react
yarn
yarn dev
```

### Foundry
```shell
$ forge build
```
```shell
$ forge test
```

```shell
$ anvil
```

```shell
forge create --rpc-url $rpc_url --private-key $owner_key contracts/PeerReview.sol:PeerReview --constructor-args "mit" 100
```

```shell
cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "addAuthor(address)" $author_addr && \
cast send --private-key $reviewer1_key --rpc-url $rpc_url $contract_addr "addReviewer(address,string[])" $reviewer1_addr "[\"dao\",\"delegate\",\"vote\"]" && \
cast send --private-key $reviewer2_key --rpc-url $rpc_url $contract_addr "addReviewer(address,string[])" $reviewer2_addr "[\"defi\",\"erc20\"]" && \
cast send --private-key $reviewer3_key --rpc-url $rpc_url $contract_addr "addReviewer(address,string[])" $reviewer3_addr "[\"nft\",\"erc721\"]" && \
cast send --private-key $author_key --rpc-url $rpc_url $contract_addr "submitData(string)" "Exploring the impact of DAOs and
web3 on decentralized governance." && \
cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "assignRandomSeedToSubmission(uint256)" 0 && \
cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "shuffleReviewers(uint256)" 0 && \
cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "findTopReviewersForSubmission(uint256)" 0 && \
cast send --private-key $reviewer1_key --rpc-url $rpc_url $contract_addr "reviewerVote(uint32,uint256)" 1 0 && \
cast send --private-key $reviewer2_key --rpc-url $rpc_url $contract_addr "reviewerVote(uint32,uint256)" 1 0 && \
cast send --private-key $reviewer3_key --rpc-url $rpc_url $contract_addr "reviewerVote(uint32,uint256)" 1 0 && \
cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "revealVotes(uint256)" 0 && \
cast call --private-key $owner_key --rpc-url $rpc_url $contract_addr "getIsApproved(uint256)" 0 && \
```
