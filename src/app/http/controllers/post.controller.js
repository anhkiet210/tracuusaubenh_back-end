import PostModel from '../../../models/post.model';
import UserModel from '../../../models/user.model';
import { upload } from '../../../helper/cloudinary';

const folder = 'ak-tracuusaubenh/img-posts';
const createPost = async (req, res, next) => {
    try {
        const { title, content, time } = req.body;
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
            tacgia: req.user.id,
            thoigian: time,
        };
        const post = await PostModel.create(infoPost);
        const user = await UserModel.findById(post._id);
        res.status(200).json({
            success: true,
            message: 'Thêm bài viết thành công.',
            data: { post, user },
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllPost = async (req, res, next) => {
    try {
        const posts = await PostModel.find({ trangthai: 'Đã duyệt' }).sort({ thoigian: 'desc' });
        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: posts,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPostByIdUser = async (req, res, next) => {
    try {
        const posts = await PostModel.find({ tacgia: req.user.id, trangthai: 'Đã duyệt' });

        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: posts,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyPostPending = async (req, res, next) => {
    try {
        const posts = await PostModel.find({ tacgia: req.user.id, trangthai: 'Chờ duyệt' });

        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: posts,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyPostDenied = async (req, res, next) => {
    try {
        const posts = await PostModel.find({ tacgia: req.user.id, trangthai: 'Từ chối' });

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
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết!',
            });
            return;
        }
        // console.log('delete post: ', res);
        post.deleteOne();
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
        post.anh = linkImg.url || post.anh;
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
        let list = [];
        for (let i of postPending) {
            const user = await UserModel.findById(i.tacgia, { hoten: 1 });
            list.push({
                post: i,
                user,
            });
        }
        res.status(200).json({
            success: true,
            message: 'Các bài viết chờ duyệt.',
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

const changeStatusPost = async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.id);
        const { status, note } = req.body;

        if (!post) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết!',
            });
            return;
        }

        post.trangthai = status || post.trangthai;
        post.ghichu = note || post.ghichu;
        post.save();
        const message = status === 'Đã duyệt' ? 'Duyệt bài viết thành công.' : 'Đã từ chối bài viết này.';
        res.status(200).json({
            success: true,
            message: message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Duyệt bài viết thất bại!',
        });
    }
};

const denyPost = async (req, res, next) => {
    try {
        const post = await findById(req.params.id);
        if (!post) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết!',
            });
            return;
        }

        post.trangthai = 'Từ chối';
        post.save();
        res.status(200).json({
            success: true,
            message: 'Đã từ chối bài viết.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Thất bại!',
        });
    }
};

const getPostManyView = async (req, res, next) => {
    try {
        const posts = await PostModel.find().sort({ luotxem: 'desc' }).limit(10);
        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Duyệt bài viết thất bại!',
        });
    }
};

const getPostById = async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.id);
        const user = await UserModel.findById(post?.tacgia, { hoten: 1, anhdaidien: 1 });
        if (!post) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết!',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: { post, user },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lấy thông tin bài viết thất bại!',
        });
    }
};

const increaseViews = async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết!',
            });
        }
        post.luotxem += 1;
        post.save();
        res.status(200).json({
            success: true,
            message: 'Thành công.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi',
        });
    }
};

export {
    createPost,
    getAllPost,
    getPostByIdUser,
    deletePost,
    updatePost,
    getPostPending,
    changeStatusPost,
    denyPost,
    getPostManyView,
    getPostById,
    increaseViews,
    getMyPostDenied,
    getMyPostPending,
};
