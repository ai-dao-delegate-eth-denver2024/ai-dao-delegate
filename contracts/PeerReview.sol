// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    }

    address[] public authors;
    Reviewer[] public reviewers;
    Submission[] public submissions;
    string public LICENSE;
    uint256 public ROI_DENOMINATOR;

    address public owner;

    //constructor that sets license and ROI_DENOMINATOR
    constructor(string memory _license, uint256 _roiDenominator) {
        LICENSE = _license; // ODC-BY-1.0
        ROI_DENOMINATOR = _roiDenominator;
        owner = msg.sender;
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
    function findTopReviewersForSubmission(uint256 submissionId)
        public
        view
        returns (address[] memory)
    {
        require(submissionId < submissions.length, "Invalid submission ID");


        ReviewerCount[] memory counts = new ReviewerCount[](reviewers.length);
        for (uint256 i = 0; i < reviewers.length; i++) {
            counts[i].reviewer = reviewers[i].addr;
            counts[i].count = countReviewerKeywordsInSubmission(submissionId, reviewers[i].addr);
        }

        // Simple insertion sort for the top 3 counts
        for (uint256 i = 1; i < counts.length; i++) {
            ReviewerCount memory key = counts[i];
            uint256 j = i - 1;

            while ((int(j) >= 0) && (counts[j].count < key.count)) {
                counts[j + 1] = counts[j];
                j--;
            }
            counts[j + 1] = key;
        }

        // Prepare the result array for the top 3 reviewers
        uint256 resultSize = reviewers.length > 3 ? 3 : reviewers.length;
        address[] memory topReviewers = new address[](resultSize);
        for (uint256 i = 0; i < resultSize; i++) {
            topReviewers[i] = counts[i].reviewer;
        }

        return topReviewers;
    }

    // // https://docs.inco.org/getting-started/example-dapps/private-voting
    // function castVote(bytes calldata encryptedVoteCount) public {}

    // function revealResult() public {
    //     //approve the submission
    //     submissions[0].isApproved = true;
    // }
}
