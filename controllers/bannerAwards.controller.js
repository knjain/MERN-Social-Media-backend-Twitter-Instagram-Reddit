const postService = require("../services/bannerAwards.service");

async function getTopThreeUsersWithMostPostsController(req, res, next) {
    try {
        const topUsers = await postService.getTopThreeUsersWithMostPosts();
        return res.status(200).json({
            success: true,
            data: topUsers,
            message: "Top three users with most posts and comments fetched successfully"
        });
    } catch (error) {
        console.error('Error fetching top users with most posts and comments:', error);
        next(error);
    }
}

module.exports = { getTopThreeUsersWithMostPostsController };
