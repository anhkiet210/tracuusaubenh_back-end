import PostModel from '../../../models/post.model';
import cloudinary from 'cloudinary';

const createPost = async (req, res, next) => {
    try {
        const { title, content, img } = req.body;
        const imgLink = await cloudinary.v2.uploader.upload(img, { folder: 'ak-tracuusaubenh/img-posts' });
        const infoPost = {
            tieude: title,
            noidung: content,
            anh: imgLink.url,
            NguoiDung: req.user.id,
        };
        const post = await PostModel.create(infoPost);
        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: post,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllPost = async (req, res, next) => {
    try {
        const posts = await PostModel.find();
        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: posts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPostByIdUser = async (req, res, next) => {
    try {
        const posts = await PostModel.find({ NguoiDung: req.user.id });

        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: posts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deletePost = async (req, res, next) => {
    try {
        await PostModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Đã xóa bài viết.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updatePost = async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.id);
        const { title, content, img } = req.body;
        const imgLink = await cloudinary.v2.uploader.upload(img, { folder: 'ak-tracuusaubenh/img-posts' });

        post.tieude = title || post.tieude;
        post.noidung = content || post.noidung;
        post.anh = imgLink.url || post.anh;
        res.status(200).json({
            success: true,
            message: 'Cập nhật bài viết thành công.',
            data: post,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPostPending = async (req, res, next) => {
    try {
        const postPending = await PostModel.find({ trangthai: 'Chờ duyệt' });
        res.status(200).json({
            success: true,
            message: 'Các bài viết chờ duyệt.',
            data: postPending,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const acceptPost = async (req, res, next) => {
    try {
        const post = await findOneAndUpdate(req.body.postId, { trangthai: 1 }, { new: true });
        res.status(200).json({
            success: true,
            message: 'Duyệt bài viết thành công.',
            data: post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Duyệt bài viết thất bại!',
        });
    }
};

export { createPost, getAllPost, getPostByIdUser, deletePost, updatePost, getPostPending, acceptPost };
