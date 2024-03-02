forge build; forge create --rpc-url "https://testnet.inco.org" --private-key "0x24bdc263fd61b12b5995e5120564734f2180e5ce6bdafe3a37342d548d2a5b8f" contracts/PeerReview.sol:PeerReview --constructor-args "mit" 100 > deployed.txt; set caddr (cat deployed.txt| grep Deployed| grep -oE '0x.*$')
cast send --private-key 0x24bdc263fd61b12b5995e5120564734f2180e5ce6bdafe3a37342d548d2a5b8f --rpc-url https://testnet.inco.org $caddr "submitData(string)" "test 57657"
cast send --private-key 0x24bdc263fd61b12b5995e5120564734f2180e5ce6bdafe3a37342d548d2a5b8f --rpc-url https://testnet.inco.org $caddr "reviewerVoteFhe(uint32,uint256)" 1 0
cast send --private-key 0x24bdc263fd61b12b5995e5120564734f2180e5ce6bdafe3a37342d548d2a5b8f --rpc-url https://testnet.inco.org $caddr "reviewerVoteFhe(uint32,uint256)" 1 0
cast send --private-key 0x24bdc263fd61b12b5995e5120564734f2180e5ce6bdafe3a37342d548d2a5b8f --rpc-url https://testnet.inco.org $caddr "reviewerVoteFhe(uint32,uint256)" 1 0
cast send --private-key 0x24bdc263fd61b12b5995e5120564734f2180e5ce6bdafe3a37342d548d2a5b8f --rpc-url https://testnet.inco.org $caddr "revealVotesFhe(uint256)" 0
cast call --private-key 0x24bdc263fd61b12b5995e5120564734f2180e5ce6bdafe3a37342d548d2a5b8f --rpc-url https://testnet.inco.org $caddr "getIsApproved(uint256)" 0
