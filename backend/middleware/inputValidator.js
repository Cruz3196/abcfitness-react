import { body, validationResult, param, query } from "express-validator";

/**
 * INPUT VALIDATION MIDDLEWARE
 *
 * Validates and sanitizes user inputs to prevent injection attacks,
 * XSS, and invalid data from reaching the database
 */

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// ===== AUTH VALIDATION RULES =====

export const validateSignUp = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validateForgotPassword = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
];

export const validateResetPassword = [
  param("token").notEmpty().trim().withMessage("Reset token is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
];

// ===== USER PROFILE VALIDATION RULES =====

export const validateEditProfile = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("newPassword")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
  body("goals")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Goals must be less than 500 characters"),
];

// ===== PRODUCT VALIDATION RULES =====

export const validateProductCreation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
];

// ===== REVIEW VALIDATION RULES =====

export const validateReview = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Review comment is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Review must be between 10 and 500 characters"),
];

// ===== CLASS/BOOKING VALIDATION RULES =====

export const validateBookingCreation = [
  param("classId").isMongoId().withMessage("Invalid class ID"),
];

// ===== TRAINER VALIDATION RULES =====

export const validateTrainerProfile = [
  body("specialization")
    .trim()
    .notEmpty()
    .withMessage("Specialization is required")
    .isLength({ max: 100 })
    .withMessage("Specialization must be less than 100 characters"),
  body("experience")
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage("Experience must be a valid number between 0 and 60"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must be less than 500 characters"),
];
