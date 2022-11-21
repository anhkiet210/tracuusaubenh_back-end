import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const cloud = cloudinary.v2;

cloud.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = async (file, folder) => {
    const image = await cloud.uploader.upload(file, { folder: folder, width: 150, crop: 'scale' });
    return image;
};

export { upload };
