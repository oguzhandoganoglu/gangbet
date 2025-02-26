
const express = require("express");
const {
    getGangPageData,
    getNotificationPageData,
    getAllGroupsPageData,
    getManagedGroupsPageData,
    getGroupDetailPageData,
    getWalletPageData,
    getProfilePageData
} = require("../controllers/pageController");

const router = express.Router();

// Gang Page
router.get("/gang/:userId", getGangPageData);

// Notification Page
router.get("/notifications/:userId", getNotificationPageData);

// Groups/All Page
router.get("/groups/all/:userId", getAllGroupsPageData);

// Groups/Managed Page
router.get("/groups/managed/:userId", getManagedGroupsPageData);

// Group Detail Page
router.get("/groups/detail/:groupId/:userId", getGroupDetailPageData);

// Wallet Page
router.get("/wallet/:userId", getWalletPageData);

// Profile Page
router.get("/profile/:userId", getProfilePageData);

module.exports = router;