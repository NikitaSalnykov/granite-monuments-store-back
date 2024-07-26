const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

class CloudinaryService {
  #options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    invalidate: true,
  };

  async uploadResource(resourcePath, opts = {}) {
    try {
      const result = await cloudinary.uploader.upload(resourcePath, {
        ...this.#options,
        ...opts,
      });
      return result;
    } catch (error) {
      console.error("Error during resource upload:", error);
      throw error;
    }
  }

  async deleteImage(resourceId) {
    const result = await cloudinary.api.delete_resources([resourceId], {
      type: "upload",
      resource_type: "image",
    });

    return result;
  }
}

const cloudinaryService = new CloudinaryService();
module.exports = cloudinaryService;
