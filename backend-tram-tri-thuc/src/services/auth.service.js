const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

class AuthService {
    static async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    static generateJwtToken(userId, expiresIn = "1h") {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
    }

    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async validateAndFindUser(email) {
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new Error("Email already in use");
        }
    }

    static async createUser({ name, email, password }) {
        const hashedPassword = await this.hashPassword(password);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        return user;
    }

    static async register({ name, email, password }) {
        await this.validateAndFindUser(email);
        const user = await this.createUser({ name, email, password });
        return this.generateJwtToken(user._id);
    }

    static async validateCredentials(email, password) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error("Email not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Incorrect password");
        }
        return user;
    }

    static async login({ email, password }) {
        const user = await this.validateCredentials(email, password);
        return this.generateJwtToken(user._id);
    }

    static generateResetToken(userId) {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10m" });
    }

    static async forgotPassword(email) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error("Email not found");
        }
        const resetToken = this.generateResetToken(user._id);
        // Note: Nodemailer is commented out in original code
        // Implement email sending logic here when ready
        return resetToken;
    }

    static verifyResetToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    static async updateUserPassword(userId, newPassword) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const hashedPassword = await this.hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        return user;
    }

    static async resetPassword({ token, newPassword }) {
        const decoded = this.verifyResetToken(token);
        await this.updateUserPassword(decoded.userId, newPassword);
    }

    static async getProfile(userId) {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}

module.exports = AuthService;
