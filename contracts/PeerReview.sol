// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "fhevm/lib/TFHE.sol";

contract PeerReview {
    struct Reviewer {
        address addr;
        string[] keywords;
    }

    struct Submission {
        address author;
        string data;
        address[] selectedReviewers;
        address[] shuffledReviewers; // Updated field to store shuffled reviewers
        bool isApproved;
        uint256 seed; // New field to store seed
        uint256 countVotes;
    }

    address[] public authors;
    Reviewer[] public reviewers;
    Submission[] public submissions;
    string public LICENSE;
    uint256 public ROI_DENOMINATOR;

    address public owner;

    string public query;

    string[] public options;
    euint8[] internal encOptions;

    uint32 MAX_INT = 2**32 - 1;
    uint8 MAX_OPTIONS = 5;

    uint32 public totalVotes;
    euint32 public totalVotesFhe;

    mapping(address => euint8) internal votes;
    mapping(uint8 => euint32) internal tally;

    //constructor that sets license and ROI_DENOMINATOR
    constructor(string memory _license, uint256 _roiDenominator) {
        LICENSE = _license; // ODC-BY-1.0
        ROI_DENOMINATOR = _roiDenominator;
        owner = msg.sender;
        options = ["Yes", "No"];
    }

    // Function to add an author, only callable by the owner
    function addAuthor(address _author) public {
        // require(msg.sender == owner, "Only the owner can add authors.");
        // for (uint256 i = 0; i < authors.length; i++) {
        //     require(authors[i] != _author, "Author already exists.");
        // }
        authors.push(_author);
    }

    // Function to add a reviewer, only callable by the owner
    function addReviewer(address _reviewer, string[] memory _keywords) public {
        // require(msg.sender == owner, "Only the owner can add reviewers.");
        reviewers.push(Reviewer(_reviewer, _keywords));
    }

    // Function to add keywords to a specific reviewer, only callable by the owner
    function addKeywordToReviewer(
        uint256 reviewerIndex,
        string memory newKeyword
    ) public {
        require(
            msg.sender == owner,
            "Only the owner can add keywords to a reviewer."
        );
        require(reviewerIndex < reviewers.length, "Reviewer does not exist.");
        reviewers[reviewerIndex].keywords.push(newKeyword);
    }

    // Function to get selected reviewers for a submission
    function getSelectedReviewers(uint256 submissionId)
        public
        view
        returns (address[] memory)
    {
        require(submissionId < submissions.length, "Invalid submission ID");
        return submissions[submissionId].selectedReviewers;
    }

    // Function to get all authors
    function getAuthors() public view returns (address[] memory) {
        return authors;
    }

    // Function to get a reviewer's keywords by address
    function getReviewerKeywords(address _reviewerAddress)
        public
        view
        returns (string[] memory)
    {
        for (uint256 i = 0; i < reviewers.length; i++) {
            if (reviewers[i].addr == _reviewerAddress) {
                return reviewers[i].keywords;
            }
        }
        revert("Reviewer not found.");
    }

    // Function to get all reviewers' addresses
    function getReviewers() public view returns (address[] memory) {
        address[] memory reviewerAddresses = new address[](reviewers.length);
        for (uint256 i = 0; i < reviewers.length; i++) {
            reviewerAddresses[i] = reviewers[i].addr;
        }
        return reviewerAddresses;
    }

    // Submit a data object
    function submitData(string memory _data) public returns (uint256) {
        Submission storage newSubmission = submissions.push();
        newSubmission.author = msg.sender;
        newSubmission.data = _data;
        uint256 submissionId = submissions.length - 1;
        emit SubmissionCreated(submissionId);
        return submissionId;
    }

    event SubmissionCreated(uint256 submissionId);

    // Function to get a submission's complete data by its ID
    function getSubmission(uint256 submissionId)
        public
        view
        returns (
            address author,
            string memory data,
            address[] memory selectedReviewers,
            address[] memory shuffledReviewers,
            bool isApproved,
            uint256 seed
        )
    {
        require(
            submissionId < submissions.length,
            "Submission does not exist."
        );
        Submission storage submission = submissions[submissionId];
        return (
            submission.author,
            submission.data,
            submission.selectedReviewers,
            submission.shuffledReviewers,
            submission.isApproved,
            submission.seed
        );
    }

    // Function to assign a random seed to a submission using getRandomNumber
    function assignRandomSeedToSubmission(uint256 submissionId) public {
        require(submissionId < submissions.length, "Invalid submission ID");
        uint256 randomSeed = getRandomNumber();
        submissions[submissionId].seed = randomSeed;
    }

    // Function to get shuffled reviewers for a submission
    function getShuffledReviewers(uint256 submissionId)
        public
        view
        returns (address[] memory)
    {
        require(submissionId < submissions.length, "Invalid submission ID");
        return submissions[submissionId].shuffledReviewers;
    }

    // Updated function to shuffle a copy of the reviewers and store it in the Submission struct
    function shuffleReviewers(uint256 submissionId) public {
        require(submissionId < submissions.length, "Invalid submission ID");
        Submission storage submission = submissions[submissionId];
        address[] memory shuffledReviewers = new address[](reviewers.length);
        for (uint256 i = 0; i < reviewers.length; i++) {
            shuffledReviewers[i] = reviewers[i].addr;
        }
        uint256 seed = submission.seed;
        for (uint256 i = 0; i < shuffledReviewers.length; i++) {
            uint256 j = (uint256(keccak256(abi.encode(seed, i))) % (i + 1));
            (shuffledReviewers[i], shuffledReviewers[j]) = (
                shuffledReviewers[j],
                shuffledReviewers[i]
            );
        }
        submission.shuffledReviewers = shuffledReviewers;
    }

    // A simple function to check if a string contains a substring
    function contains(string memory _string, string memory _substring)
        public
        pure
        returns (bool)
    {
        bytes memory stringBytes = bytes(_string);
        bytes memory substringBytes = bytes(_substring);

        // Simple loop to check substring
        for (
            uint256 i = 0;
            i <= stringBytes.length - substringBytes.length;
            i++
        ) {
            bool isMatch = true;
            for (uint256 j = 0; j < substringBytes.length; j++) {
                if (stringBytes[i + j] != substringBytes[j]) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch) return true;
        }
        return false;
    }

    // Function to count how many of a reviewer's keywords appear in a submission's data
    function countReviewerKeywordsInSubmission(
        uint256 submissionId,
        address reviewerAddress
    ) public view returns (uint256) {
        require(submissionId < submissions.length, "Invalid submission ID");
        Submission storage submission = submissions[submissionId];
        string[] memory reviewerKeywords = getReviewerKeywords(reviewerAddress);
        uint256 keywordCount = 0;
        for (uint256 i = 0; i < reviewerKeywords.length; i++) {
            if (contains(submission.data, reviewerKeywords[i])) {
                keywordCount++;
            }
        }
        return keywordCount;
    }

    // Function to generate a pseudo-random number based on block timestamp and sender's address
    function getRandomNumber() public view returns (uint256) {
        uint256 seed = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        );
        return seed;
    }

    // Temporary structure to hold reviewer counts
    struct ReviewerCount {
        address reviewer;
        uint256 count;
    }

    // Function to find the top 3 reviewers based on the count of their keywords in a submission's data
    function findTopReviewersForSubmission(uint256 submissionId) public {
        require(submissionId < submissions.length, "Invalid submission ID");

        ReviewerCount[] memory counts = new ReviewerCount[](
            submissions[submissionId].shuffledReviewers.length
        );
        for (
            uint256 i = 0;
            i < submissions[submissionId].shuffledReviewers.length;
            i++
        ) {
            counts[i].reviewer = submissions[submissionId].shuffledReviewers[i];
            counts[i].count = countReviewerKeywordsInSubmission(
                submissionId,
                submissions[submissionId].shuffledReviewers[i]
            );
        }

        // Directly track the top 3 reviewers
        address[] memory topReviewers = new address[](3);
        uint256[] memory topCounts = new uint256[](3);

        for (uint256 i = 0; i < reviewers.length; i++) {
            uint256 currentCount = counts[i].count;
            for (uint256 j = 0; j < 3; j++) {
                if (currentCount > topCounts[j]) {
                    for (uint256 k = 2; k > j; k--) {
                        topReviewers[k] = topReviewers[k - 1];
                        topCounts[k] = topCounts[k - 1];
                    }
                    topReviewers[j] = counts[i].reviewer;
                    topCounts[j] = currentCount;
                    break;
                }
            }
        }

        submissions[submissionId].selectedReviewers = topReviewers;
    }

    //plain text voting
    // Modified to allow voting only if there are less than 3 submission's countVotes
    // and increment countVotes every time someone casts a vote
    function reviewerVote(uint32 vote, uint256 submissionId) public {
        require(submissionId < submissions.length, "Invalid submission ID");
        require(
            submissions[submissionId].countVotes < 3,
            "Vote limit reached for this submission."
        );

        if (vote == 1) {
            totalVotes += 1;
            submissions[submissionId].countVotes += 1; // Increment countVotes for the submission
        }
    }

    // Modified to allow revealing votes only if countVotes is 3 for a specific submission
    function revealVotes(uint256 submissionId) public view returns (uint32) {
        require(
            submissions[submissionId].countVotes == 2,
            "Votes can only be revealed if countVotes is 3."
        );
        return totalVotes;
    }

    //FHE voting
    function reviewerVoteFhe(uint32 vote, uint256 submissionId) public {
        require(submissionId < submissions.length, "Invalid submission ID");
        require(
            submissions[submissionId].countVotes < 3,
            "Vote limit reached for this submission."
        );
        ebool maybetrue = TFHE.eq(vote, TFHE.asEuint32(0x01));
        totalVotesFhe = TFHE.cmux(
            maybetrue,
            TFHE.add(totalVotesFhe, TFHE.asEuint32(0x01)),
            totalVotesFhe
        );
        if (vote == 0x01) {
            submissions[submissionId].countVotes += 1; // Increment countVotes for the submission
        }
    }

    function revealVotesFhe(uint256 submissionId)
        public
        view
        returns (euint32)
    {
        require(
            submissions[submissionId].countVotes == 2,
            "Votes can only be revealed if countVotes is 3."
        );
        return totalVotesFhe;
    }

    // // https://docs.inco.org/getting-started/example-dapps/private-voting
    // function castVote(bytes calldata encryptedVoteCount) public {}

    // function revealResult() public {
    //     //approve the submission
    //     submissions[0].isApproved = true;
    // }
}
