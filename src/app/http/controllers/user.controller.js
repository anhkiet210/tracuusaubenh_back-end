import UserModel from '../../../models/user.model';
import bcrypt from 'bcrypt';
import { sendToken } from '../../../helper/jwt.helper';

const saltRounds = 10;

const Register = async (req, res, next) => {
    try {
        const email = req.body.email;
        const checkUser = await UserModel.findOne({ email: email });
        if (checkUser) {
            res.status(402).json({
                success: false,
                message: 'Người dùng đã tồn tại',
            });
        } else {
            const hoten = req.body.name;
            const hashPass = bcrypt.hashSync(req.body.password, saltRounds);
            const sdt = req.body.phone;

            const infoUser = {
                hoten: hoten,
                email: email,
                matkhau: hashPass,
                sdt: sdt,
            };

            await UserModel.create(infoUser);
            res.status(200).json({
                success: true,
                message: 'Đăng ký tài khoản thành công',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: 'Hãy nhập đầy đủ thông tin!',
            });
        }

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác!',
            });
        }

        const isPassValid = bcrypt.compareSync(password, user.matkhau);
        if (!isPassValid) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu không chính xác!',
            });
        }

        sendToken(user, res, 'Đăng nhập thành công.');
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllUser = async (req, res, next) => {
    try {
        const users = await UserModel.find({}, { matkhau: 0 });
        res.status(200).json({
            success: true,
            users: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getInfoUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id, { matkhau: 0 });
        return res.status(200).json({
            success: true,
            message: 'Lấy thông tin thành công.',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(404).json({
                success: false,
                message: 'Hãy nhập đầy đủ thông tin!',
            });
        }

        const user = await UserModel.findById(req.user.id);
        const isPassValid = bcrypt.compareSync(currentPassword, user.matkhau);
        if (!isPassValid) {
            return res.status(404).json({
                success: false,
                message: 'Mật khẩu hiện tại không đúng!',
            });
        }

        const hashPass = bcrypt.hashSync(newPassword, saltRounds);
        user.matkhau = hashPass;
        user.save();
        return res.status(200).json({
            success: true,
            message: 'Đổi mật khẩu thành công',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { Register, Login, getAllUser, getInfoUser, changePassword };
