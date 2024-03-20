const bannerService = require("../services/banner.service");
const ApiError = require("../utils/apiError.util");
const resUtil = require("../utils/response");
const errors = require("../utils/errorResponse.util");
const fileUpload = require("../utils/fileUpload.util");
const configs = require("../configs/config");

module.exports = {
  getAllBanners: async (req, res, next) => {
    try {
      const banners = await bannerService.getAllBanners();
      console.log(banners.length > 0);
      if (banners.length > 0) {
        return res.status(200).json({
          data: banners,
          success: true,
          message: `Active Banners`,
        });
      } else {
        throw new ApiError(404, "No active banner");
      }
    } catch (error) {
      next(error);
    }
  },

  getBannerById: async (req, res) => {
    const { bannerId } = req.params;
    try {
      const banner = await bannerService.getBannerById(bannerId);
      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }
      res.json(banner);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching banner" });
    }
  },

  createbanner: async (req, res, next) => {
    try {
      const file = req.file;
      const { bannerType } = req.body;
      const { id } = req.user;

      if (!file) return errors.error400(next, "Banner is missing.");

      let bannerUrl;
      if (file) {
        // Upload file
        bannerUrl = await fileUpload.handleFileUpload(
          req,
          configs.BANNERS_PATH
        );
      }
      const requiredFields = [
        { name: "bannerType", message: "Missing bannerType" },
      ];

      for (const field of requiredFields) {
        if (!req.body[field.name] || req.body[field.name] === "") {
          return errors.error400(next, field.message);
        }
      }

      const response = await bannerService.createBanner(
        id,
        bannerType,
        bannerUrl
      );

      if (response) {
        return res.status(201).json({
          data: response,
          success: true,
          message: `Banner added in ${bannerType}`,
        });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  updatebanner: async (req, res, next) => {
    const userId = req.user.id;
    const { bannerId } = req.params;
    const file = req.file;
    const { bannerType, active } = req.body;

    // console.log(id, bannerId, req.file, req.bannerType);

    if (!file && !bannerType && !active)
      return errors.error400(next, "No field provided to update");

    // Check if bannerId is valid
    if (!bannerId) {
      return errors.error400(next, "Banner ID is missing");
    }

    let bannerUrl;
    if (file) {
      bannerUrl = await fileUpload.handleFileUpload(req, configs.BANNERS_PATH);
    }

    try {
      const updatedBanner = await bannerService.updateBanner(
        userId,
        bannerId,
        bannerUrl,
        bannerType,
        active
      );
      return res.status(200).json({
        data: updatedBanner,
        success: true,
        message: "Banner updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  deleteBanner: async (req, res, next) => {
    const userId = req.user.id;
    const { bannerId } = req.params;

    try {
      await bannerService.deleteBanner(userId, bannerId);
      return res.status(200).json({
        success: true,
        message: "Banner deleted successfully.",
      });
    } catch (error) {
      next(error);
      // console.error(error);
      // res.status(500).json({ error: error.message });
    }
  },
};
