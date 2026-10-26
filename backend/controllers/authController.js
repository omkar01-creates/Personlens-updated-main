
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const User = require("../models/User");

// Initialize Resend for email delivery.
const resend = new Resend(process.env.RESEND_API_KEY);

// Check that required secrets exist and are sufficiently strong.
function requireSecret(name) {
  const secret = process.env[name];

  if (!secret || secret.length < 32) {
    throw new Error(
      `${name} must be configured with a secret of at least 32 characters.`
    );
  }

  return secret;
}

// Create a login token.
function createToken(user) {
  return jwt.sign(
    { id: user._id.toString() },
    requireSecret("JWT_SECRET"),
    { expiresIn: "7d" }
  );
}

// Escape user-provided text before inserting it into HTML.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

// Register a new user.
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    // bcrypt supports passwords up to 72 bytes.
    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        message: "Password must not exceed 72 bytes.",
      });
    }

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    const token = createToken(user);

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      message: "Unable to register. Please try again later.",
    });
  }
};

// Log in an existing user.
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in. Please try again later.",
    });
  }
};

// Get the currently authenticated user's information.
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated.",
      });
    }

    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("Get user error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve user information.",
    });
  }
};

// Send a password-reset email using Resend.
const forgotPassword = async (req, res) => {
  const genericMessage =
    "If an account exists with this email, password reset instructions will be sent.";

  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Please enter your email address.",
      });
    }

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    // Use the same response whether or not the account exists.
    if (!user) {
      return res.status(200).json({
        message: genericMessage,
      });
    }

    const resetSecret = requireSecret("PASSWORD_RESET_SECRET");
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is not configured.");
    }

    // Only allow HTTPS frontend URLs in production.
    const parsedFrontendUrl = new URL(frontendUrl);

    if (
      process.env.NODE_ENV === "production" &&
      parsedFrontendUrl.protocol !== "https:"
    ) {
      throw new Error("FRONTEND_URL must use HTTPS in production.");
    }

    const resetToken = jwt.sign(
      {
        id: user._id.toString(),
        purpose: "password-reset",
      },
      resetSecret,
      { expiresIn: "15m" }
    );

    const resetLink =
      `${frontendUrl.replace(/\/+$/, "")}` +
      `/reset-password?token=${encodeURIComponent(resetToken)}`;

    const { data, error } = await resend.emails.send({
      // Resend's test sender has recipient restrictions.
      from: "PersonLens <onboarding@resend.dev>",
      to: [user.email],
      subject: "PersonLens Password Reset",
      text:
        `Hello ${user.name},\n\n` +
        "We received a request to reset your PersonLens password.\n\n" +
        `Use this link within 15 minutes:\n${resetLink}\n\n` +
        "If you did not request this, you can ignore this email.",
      html: `
        <p>Hello ${escapeHtml(user.name)},</p>
        <p>We received a request to reset your PersonLens password.</p>
        <p>
          <a href="${escapeHtml(resetLink)}">Reset your password</a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error("Password reset email could not be sent.");
    }

    if (!data || !data.id) {
      throw new Error("Resend did not confirm the email request.");
    }

    console.log("Password reset email accepted by Resend.");

    return res.status(200).json({
      message: genericMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      message: "Unable to process your request. Please try again later.",
    });
  }
};

// Verify the reset token and save the new password.
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (
      typeof token !== "string" ||
      !token ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Reset token and new password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        message: "Password must not exceed 72 bytes.",
      });
    }

    const decoded = jwt.verify(
      token,
      requireSecret("PASSWORD_RESET_SECRET")
    );

    if (
      decoded.purpose !== "password-reset" ||
      !decoded.id
    ) {
      return res.status(400).json({
        message: "Invalid password-reset token.",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({
        message: "Invalid password-reset request.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(400).json({
        message:
          "Reset link is invalid or expired. Please request a new one.",
      });
    }

    console.error("Reset password error:", error.message);

    return res.status(500).json({
      message: "Unable to reset your password. Please try again later.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
};
