import PostModel from '../../../models/post.model';
import UserModel from '../../../models/user.model';
import { upload } from '../../../helper/cloudinary';

const folder = 'ak-tracuusaubenh/img-posts';
const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const { file } = req.files;
        if (!title) {
            return res.status(404).json({
                success: false,
                message: 'Hãy nhập tiêu đề bài viết!',
            });
        }
        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Hãy nhập nội dung bài viết!',
            });
        }

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'Hãy thêm ảnh cho bài viết!',
            });
        }

        const imgLink = await upload(file.tempFilePath, folder);
        const infoPost = {
            tieude: title,
            noidung: content,
            anh: imgLink.url,
            NguoiDung: req.user.id,
        };
        const post = await PostModel.create(infoPost);
        res.status(200).json({
            success: true,
            message: 'Thêm bài viết thành công.',
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
        let list;
        for (let i of posts) {
            const user = await UserModel.findById(i.NguoiDung, { hoten: 1, anhdaidien: 1 });
            list.push({
                post: i,
                user: user,
            });
        }
        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: list,
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
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Bài viết không tồn tại!',
            });
        }
        const { title, content } = req.body;
        const { file } = req.files;

        let linkImg;

        if (!file) {
            linkImg = null;
        } else {
            linkImg = await upload(file.tempFilePath, folder);
        }

        post.tieude = title || post.tieude;
        post.noidung = content || post.noidung;
        post.anh = imgLink.url || post.anh;
        post.save();
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
        res.status(501).json({
            success: false,
            message: 'Duyệt bài viết thất bại!',
        });
    }
};

export { createPost, getAllPost, getPostByIdUser, deletePost, updatePost, getPostPending, acceptPost };
