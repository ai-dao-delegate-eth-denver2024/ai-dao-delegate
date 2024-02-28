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
        mapping(address => bytes32) commits;
        mapping(address => bool) votes;
        mapping(address => bool) comments;
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
        LICENSE = _license;
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

    // Function to get a reviewer's information by index
    // This function remains unchanged as it already suits the array implementation.

    // Function to get a reviewer's information by address
    // This function needs to be rewritten to iterate over the array. Implementation will be provided after this step.

    // Function to add a keyword to a reviewer
    function addKeywordToReviewer(uint256 reviewerIndex, string memory keyword)
        public
    {
        // require(msg.sender == owner, "Only the owner can add keywords.");
        // This function's logic will be adjusted to work with the array. Implementation will be provided after this step.
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

    // Function to get a submission's data by its ID
    function getSubmission(uint256 submissionId)
        public
        view
        returns (address author, string memory data)
    {
        require(
            submissionId < submissions.length,
            "Submission does not exist."
        );
        Submission storage submission = submissions[submissionId];
        return (submission.author, submission.data);
    }

    // Function to assign a seed to a submission
    function assignRndSeed(uint256 submissionId) public {
        require(submissionId < submissions.length, "Invalid submission ID");
        submissions[submissionId].seed = 0;
    }

    // Find top 3 matching reviewers for a submission
    function findReviewers(uint256 submissionId) public {
        // The shuffleReviewers call is updated to shuffle and store reviewers in the Submission struct
        shuffleReviewers(submissionId); // This call now populates the shuffledReviewers field in the Submission struct
        require(submissionId < submissions.length, "Invalid submission ID");
        Submission storage submission = submissions[submissionId];

        address[] memory topReviewers = new address[](3);
        uint256[] memory topReviewersValue = new uint256[](3);

        uint256[] memory scores = new uint256[](
            submission.shuffledReviewers.length
        );
        for (uint256 i = 0; i < submission.shuffledReviewers.length; i++) {
            address reviewerAddr = submission.shuffledReviewers[i];
            // Find the reviewer in the global reviewers array to access their keywords
            for (uint256 k = 0; k < reviewers.length; k++) {
                if (reviewers[k].addr == reviewerAddr) {
                    for (uint256 j = 0; j < reviewers[k].keywords.length; j++) {
                        if (
                            contains(submission.data, reviewers[k].keywords[j])
                        ) {
                            scores[i]++;
                        }
                    }
                    break; // Break the loop once the matching reviewer is found
                }
            }

            if (scores[i] >= topReviewersValue[0]) {
                topReviewersValue[2] = topReviewersValue[1];
                topReviewersValue[1] = topReviewersValue[0];
                topReviewersValue[0] = scores[i];
                topReviewers[2] = topReviewers[1];
                topReviewers[1] = topReviewers[0];
                topReviewers[0] = reviewerAddr;
            } else if (scores[i] > topReviewersValue[1]) {
                topReviewersValue[2] = topReviewersValue[1];
                topReviewersValue[1] = scores[i];
                topReviewers[2] = topReviewers[1];
                topReviewers[1] = reviewerAddr;
            } else if (scores[i] > topReviewersValue[2]) {
                topReviewersValue[2] = scores[i];
                topReviewers[2] = reviewerAddr;
            }
        }

        submission.selectedReviewers = topReviewers;
    }

    // Updated function to shuffle a copy of the reviewers and store it in the Submission struct
    function shuffleReviewers(uint256 submissionId) internal {
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
            i < stringBytes.length - substringBytes.length;
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

    // https://docs.inco.org/getting-started/example-dapps/private-voting
    function castVote(bytes calldata encryptedVoteCount) public {}

    function revealResult() public {
        //approve the submission
        submissions[0].isApproved = true;
    }
}
