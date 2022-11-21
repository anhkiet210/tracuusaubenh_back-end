import CropModel from '../../../models/crop.model';
import cloudinary from 'cloudinary';
import { upload } from '../../../helper/cloudinary';

const folder = 'ak-tracuusaubenh/img-crops';
const createCrop = async (req, res, next) => {
    try {
        const { cropName, shortDes } = req.body;
        const { file } = req.files;

        if (!cropName) {
            return res.status(404).json({
                success: false,
                message: 'Hãy nhập tên loại cây trồng!',
            });
        }

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'Hãy thêm ảnh cho loại cây trồng!',
            });
        }

        const isCrop = await CropModel.findOne({ tenloai: cropName });
        if (isCrop) {
            return res.status(502).json({
                success: false,
                message: 'Loại cây đã tồn tại.',
            });
        }

        const linkImg = await upload(file.tempFilePath, folder);

        const cropInfo = {
            tenloai: cropName,
            anh: linkImg.url,
            mota: shortDes,
        };
        const crop = await CropModel.create(cropInfo);

        res.status(200).json({
            success: true,
            message: 'Thêm loại cây thành công.',
            data: crop,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};

const getAllCrop = async (req, res, next) => {
    try {
        const listCops = await CropModel.find();

        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: listCops,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCrop = async (req, res, next) => {
    try {
        const Crop = await CropModel.findById(req.params.id);
        if (!Crop) {
            return res.status(404).json({
                success: false,
                message: 'Loại cây trồng không tồn tại!',
            });
        }
        const { cropName, shortDes } = req.body;
        const { file } = req.files;
        const linkImg = await upload(file.tempFilePath, folder);
        Crop.tenloai = cropName || Crop.tenloai;
        Crop.anh = linkImg.url || Crop.anh;
        Crop.mota = shortDes || Crop.mota;
        await Crop.save();
        res.status(200).json({
            success: true,
            message: 'Cập nhật loại cây thành công.',
            data: Crop,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getCropById = async (req, res, next) => {
    try {
        const crop = await CropModel.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: crop,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteCropById = async (req, res, next) => {
    try {
        await CropModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Xóa loại cây thành công.',
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createCrop, updateCrop, getAllCrop, getCropById, deleteCropById };
