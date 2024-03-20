const Post = require("../models/posts.model");
//const User = require("../models/user.model");

async function getTopThreeUsersWithMostPosts() {
    try {
        const topUsers = await Post.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalPosts: { $sum: 1 }
                }
            },
            {
                $sort: { totalPosts: -1 }
            },
            {
                $limit: 3
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    _id: 0,
                    user: {
                        _id: "$_id",
                        fullName: { $arrayElemAt: ["$userDetails.fullName", 0] },
                        userName: { $arrayElemAt: ["$userDetails.userName", 0] },
                        profilePicUrl: { $arrayElemAt: ["$userDetails.profilePicUrl", 0] },
                        totalPosts: "$totalPosts"
                    }
                }
            }
        ]);
        return topUsers;
    } catch (error) {
        console.error('Error fetching top users with most posts:', error);
        throw error;
    }
}

module.exports = { getTopThreeUsersWithMostPosts };
/////////////////////////////////////////////////////////////////////////////

