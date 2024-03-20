const Banner = require("../models/banner.model");
const ApiError = require("../utils/apiError.util");
const configs = require("../configs/config");

module.exports = {
  getAllBanners: async () => {
    return new Promise((resolve, reject) => {
      Banner.find({ active: true })
        .then((banners) => {
          resolve(banners);
        })
        .catch((error) => {
          console.error(error);
          reject(new Error("Error fetching banners"));
        });
    });
  },

  getBannerById: async (bannerId) => {
    try {
      const banner = await Banner.findById(bannerId);
      return banner;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching original banner");
    }
  },

  createBanner: async (userId, bannerType, bannerUrl) => {
    if (userId != configs.ADMIN_ACCESS) {
      throw new ApiError(401, "Only Admin can add banner");
    }

    return new Promise((resolve, reject) => {
      const newBanner = new Banner({
        bannerType: bannerType,
        bannerUrl: bannerUrl,
      });

      newBanner
        .save()
        .then((savedBanner) => {
          resolve(savedBanner);
        })
        .catch((error) => {
          // console.error(error);
          reject(new ApiError(500, error.message));
        });
    });
  },

  updateBanner: async (userId, bannerId, bannerUrl, bannerType, active) => {
    return new Promise((resolve, reject) => {
      Banner.findById(bannerId)
        .then((banner) => {
          if (!banner) {
            reject(new ApiError(404, "Banner not found"));
            return;
          }

          if (userId === configs.ADMIN_ACCESS) {
            const updateObject = {};
            if (bannerUrl) {
              updateObject.bannerUrl = bannerUrl;
            }
            if (bannerType) {
              updateObject.bannerType = bannerType;
            }
            if (active) {
              updateObject.active = active;
            }
            // Check if updatedData contains at least one field to update
            if (Object.keys(updateObject).length === 0) {
              reject(
                new ApiError(
                  400,
                  "Provide either banner or bannerType to update."
                )
              );
              return;
            }

            return Banner.findByIdAndUpdate(bannerId, updateObject, {
              new: true,
            });
          } else {
            reject(new ApiError(401, "Only Admin can update the banner."));
            return;
          }
        })
        .then((updatedBanner) => {
          resolve(updatedBanner);
        })
        .catch((error) => {
          console.error(error);
          reject(new ApiError(500, "Error updating banner"));
        });
    });
  },

  deleteBanner: async (userId, bannerId) => {
    return new Promise((resolve, reject) => {
      // Check if the user is authorized to delete the banner
      if (userId !== configs.ADMIN_ACCESS) {
        reject(new ApiError(401, "Only Admin can delete this banner"));
        return;
      }

      Banner.findByIdAndDelete(bannerId)
        .then((deletedBanner) => {
          if (!deletedBanner) {
            // No banner was found to delete, treat this as a "not found" error
            reject(new ApiError(404, "Banner not found"));
            return;
          }
          resolve("Banner deleted successfully");
        })
        .catch((error) => {
          // Log the error for debugging purposes
          console.error(error);
          // Since any error at this point is unexpected, generalize the error for the response
          reject(new ApiError(500, "Error deleting banner"));
        });
    });
  },
};
