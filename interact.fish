set rpc_url https://linea-goerli.infura.io/v3/2VqSICfz9lbTcfjmNqvNYRhgiWX
set owner_addr 0x5873298b68497fad590f68221D9a8d134902DE64
set author_addr 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
set reviewer1_addr 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
set reviewer2_addr 0x90F79bf6EB2c4f870365E785982E1f101E93b906
set reviewer3_addr 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
set owner_key 0x24bdc263fd61b12b5995e5120564734f2180e5ce6bdafe3a37342d548d2a5b8f
set author_key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
set reviewer1_key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
set reviewer2_key 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
set reviewer3_key 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a
set contract_addr 0x5FbDB2315678afecb367f032d93F642f64180aa3 
# set rpc_url http://localhost:8545
# set owner_addr 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
# set author_addr 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
# set reviewer1_addr 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
# set reviewer2_addr 0x90F79bf6EB2c4f870365E785982E1f101E93b906
# set reviewer3_addr 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
# set owner_key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
# set author_key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
# set reviewer1_key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
# set reviewer2_key 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
# set reviewer3_key 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a
# set contract_addr 0x5FbDB2315678afecb367f032d93F642f64180aa3 
source create_contract_abi.sh && \
forge build && \
forge create --rpc-url $rpc_url --private-key $owner_key contracts/PeerReview.sol:PeerReview --constructor-args "mit" 100 && \
# cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "addAuthor(address)" $author_addr && \
# cast send --private-key $reviewer1_key --rpc-url $rpc_url $contract_addr "addReviewer(address,string[])" $reviewer1_addr "[\"dao\",\"delegate\",\"vote\"]" && \
# cast send --private-key $reviewer2_key --rpc-url $rpc_url $contract_addr "addReviewer(address,string[])" $reviewer2_addr "[\"defi\",\"erc20\"]" && \
# cast send --private-key $reviewer3_key --rpc-url $rpc_url $contract_addr "addReviewer(address,string[])" $reviewer3_addr "[\"nft\",\"erc721\"]" && \
# cast send --private-key $author_key --rpc-url $rpc_url $contract_addr "submitData(string)" "Exploring the impact of DAOs and web3 on decentralized governance." && \
# cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "assignRandomSeedToSubmission(uint256)" 0 && \
# cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "shuffleReviewers(uint256)" 0 && \
# cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "findTopReviewersForSubmission(uint256)" 0 && \
# cast send --private-key $reviewer1_key --rpc-url $rpc_url $contract_addr "reviewerVote(uint32,uint256)" 1 0 && \
# cast send --private-key $reviewer2_key --rpc-url $rpc_url $contract_addr "reviewerVote(uint32,uint256)" 1 0 && \
# cast send --private-key $reviewer3_key --rpc-url $rpc_url $contract_addr "reviewerVote(uint32,uint256)" 1 0 && \
# cast send --private-key $owner_key --rpc-url $rpc_url $contract_addr "revealVotes(uint256)" 0 && \
# cast call --private-key $owner_key --rpc-url $rpc_url $contract_addr "getIsApproved(uint256)" 0 && \
echo done
