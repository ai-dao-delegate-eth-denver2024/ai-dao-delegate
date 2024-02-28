// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/PeerReview.sol";

contract PeerReviewTest is Test {
    PeerReview peerReview;
    string expectedLicense = "Test License";
    uint256 expectedRoiDenominator = 1000;

    function setUp() public {
        peerReview = new PeerReview(expectedLicense, expectedRoiDenominator);
    }

    function testInitialLicenseSetting() public {
        assertEq(peerReview.LICENSE(), expectedLicense);
    }

    function addAuthors() internal {
        address[2] memory authors = [
            0x70997970C51812dc3A010C7d01b50e0d17dc79C8, // Anvil's local test account 1
            0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC // Anvil's local test account 2
        ];

        for (uint256 i = 0; i < authors.length; i++) {
            peerReview.addAuthor(authors[i]);
        }
    }

    function testAddAuthor() public {
        addAuthors();

        address[2] memory expectedAuthors = [
            0x70997970C51812dc3A010C7d01b50e0d17dc79C8, // Anvil's local test account 1
            0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC // Anvil's local test account 2
        ];

        for (uint256 i = 0; i < expectedAuthors.length; i++) {
            assertEq(peerReview.authors(i), expectedAuthors[i]);
        }
    }

    function setupReviewersAndKeywords() internal {
        address[4] memory reviewers = [
            0x90F79bf6EB2c4f870365E785982E1f101E93b906, // Anvil's local test account 3
            0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65, // Anvil's local test account 4
            0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc, // Anvil's local test account 5
            0x976EA74026E726554dB657fA54763abd0C3a0aa9 // Anvil's local test account 6
        ];
        string[][] memory keywords = new string[][](4);
        keywords[0] = new string[](1);
        keywords[0][0] = "gasless";
        keywords[1] = new string[](1);
        keywords[1][0] = "scalability";
        keywords[2] = new string[](1);
        keywords[2][0] = "security";
        keywords[3] = new string[](1);
        keywords[3][0] = "usability";

        for (uint256 i = 0; i < reviewers.length; i++) {
            peerReview.addReviewer(reviewers[i], keywords[i]);
        }
    }

    function testAddReviewer() public {
        setupReviewersAndKeywords();
        address[4] memory expectedReviewers = [
            0x90F79bf6EB2c4f870365E785982E1f101E93b906, // Anvil's local test account 3
            0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65, // Anvil's local test account 4
            0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc, // Anvil's local test account 5
            0x976EA74026E726554dB657fA54763abd0C3a0aa9 // Anvil's local test account 6
        ];

        string[][] memory keywords = new string[][](4);
        keywords[0] = new string[](1);
        keywords[0][0] = "gasless";
        keywords[1] = new string[](1);
        keywords[1][0] = "scalability";
        keywords[2] = new string[](1);
        keywords[2][0] = "security";
        keywords[3] = new string[](1);
        keywords[3][0] = "usability";

        for (uint256 i = 0; i < expectedReviewers.length; i++) {

            // Test getting reviewer by address
            (
                address reviewerAddrByAddress,
                string[] memory reviewerKeywordsByAddress
            ) = peerReview.getReviewerByAddress(expectedReviewers[i]);
            assertEq(reviewerAddrByAddress, expectedReviewers[i]);
            for (uint256 j = 0; j < keywords[i].length; j++) {
                assertEq(reviewerKeywordsByAddress[j], keywords[i][j]);
            }
        }
    }

    function addKeywordsToSpecificReviewers() internal {
        peerReview.addKeywordToReviewer(2, "transactions");
        peerReview.addKeywordToReviewer(3, "fees");
    }

    // Function to submit data, reusable in other tests
    function submitData() internal returns (uint256) {
        string
            memory testData = "I'd like to have channels with sponsors in discord to be functioning on the first day of the hackathon";
        return peerReview.submitData(testData);
    }

    function testAddKeywordsToReviewers() public {
        setupReviewersAndKeywords();
        addKeywordsToSpecificReviewers();
        // Verifying "transactions" keyword for reviewer 3
        (, string[] memory reviewer3Keywords) = peerReview.getReviewer(2);
        assertEq(
            reviewer3Keywords[reviewer3Keywords.length - 1],
            "transactions"
        );

        // Verifying "fees" keyword for reviewer 4
        (, string[] memory reviewer4Keywords) = peerReview.getReviewer(3);
        assertEq(reviewer4Keywords[reviewer4Keywords.length - 1], "fees");
    }

    // Test for the submitData function
    function testSubmitData() public {
        string
            memory testData = "I'd like to have channels with sponsors in discord to be functioning on the first day of the hackathon";
        uint256 submissionId = submitData();
        (, string memory data) = peerReview.getSubmission(submissionId);
        assertEq(data, testData);
    }

    // Test for the getAuthors function
    function testGetAuthors() public {
        addAuthors(); // Add authors to the contract

        address[2] memory expectedAuthors = [
            0x70997970C51812dc3A010C7d01b50e0d17dc79C8, // Anvil's local test account 1
            0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC // Anvil's local test account 2
        ];

        address[] memory actualAuthors = peerReview.getAuthors();

        for (uint256 i = 0; i < expectedAuthors.length; i++) {
            assertEq(actualAuthors[i], expectedAuthors[i]);
        }
    }

    // Test for reverting addAuthor if author already exists
    // function testRevertAddExistingAuthor() public {
    //     address existingAuthor = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Anvil's local test account 1
    //     bool reverted = false;

    //     try peerReview.addAuthor(existingAuthor) {
    //         // This call should revert. If it doesn't, force the test to fail.
    //         assertTrue(false, "Adding an existing author did not revert.");
    //     } catch {
    //         reverted = true;
    //     }

    //     assertTrue(reverted, "Expected revert when adding an existing author.");
    // }
}
