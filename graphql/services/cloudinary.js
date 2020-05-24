const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const save = async images => {
  const results = await images.map(image =>
    cloudinary.v2.uploader.upload(image.path, {
      eager: [
        {
          quality: "auto:low"
        }
      ],
      eager_async: true,
      eager_notification_url: "https://cloudinary.free.beeceptor.com"
    })
  );
  return results;
};

const remove = async id => {
  const result = await cloudinary.v2.uploader.destroy(id);
  return result;
};

module.exports = { save, remove };
