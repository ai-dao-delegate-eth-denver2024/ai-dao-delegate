rm -rf abi
solc --abi --optimize --base-path . --include-path node_modules/ contracts/PeerReview.sol -o abi
cp abi/PeerReview.abi abi/PeerReview.json
