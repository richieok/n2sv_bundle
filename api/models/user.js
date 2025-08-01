import { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

// User Schema Definition
const userSchema = new Schema(
    {
        // Basic Information
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
            match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [4, 'Password must be at least 6 characters long'],
            select: false // Don't include password in queries by default
        },

        // Personal Information
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters']
        },

        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters']
        },

        dateOfBirth: {
            type: Date,
            validate: {
                validator: function (value) {
                    return value < new Date()
                },
                message: 'Date of birth must be in the past'
            }
        },

        phoneNumber: {
            type: String,
            trim: true,
            match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
        },

        // Profile Information
        avatar: {
            type: String, // URL to profile picture
            default: null
        },

        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
            trim: true
        },

        // Address Information
        address: {
            street: {
                type: String,
                trim: true,
                maxlength: [100, 'Street address cannot exceed 100 characters']
            },
            city: {
                type: String,
                trim: true,
                maxlength: [50, 'City cannot exceed 50 characters']
            },
            state: {
                type: String,
                trim: true,
                maxlength: [50, 'State cannot exceed 50 characters']
            },
            zipCode: {
                type: String,
                trim: true,
                match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code']
            },
            country: {
                type: String,
                trim: true,
                maxlength: [50, 'Country cannot exceed 50 characters'],
                default: 'United States'
            }
        },

        // Account Status
        isActive: {
            type: Boolean,
            default: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        role: {
            type: String,
            enum: ['user', 'admin', 'moderator', 'premium'],
            default: 'user'
        },

        // Authentication & Security
        emailVerificationToken: {
            type: String,
            select: false
        },

        emailVerificationExpires: {
            type: Date,
            select: false
        },

        passwordResetToken: {
            type: String,
            select: false
        },

        passwordResetExpires: {
            type: Date,
            select: false
        },

        lastLogin: {
            type: Date,
            default: null
        },

        loginAttempts: {
            type: Number,
            default: 0
        },

        lockUntil: {
            type: Date,
            select: false
        },

        // Preferences
        preferences: {
            theme: {
                type: String,
                enum: ['light', 'dark', 'auto'],
                default: 'light'
            },
            language: {
                type: String,
                default: 'en'
            },
            notifications: {
                email: {
                    type: Boolean,
                    default: true
                },
                push: {
                    type: Boolean,
                    default: true
                },
                sms: {
                    type: Boolean,
                    default: false
                }
            },
            privacy: {
                showEmail: {
                    type: Boolean,
                    default: false
                },
                showPhone: {
                    type: Boolean,
                    default: false
                },
                profileVisible: {
                    type: Boolean,
                    default: true
                }
            }
        },

        // Social Media Links
        socialMedia: {
            twitter: {
                type: String,
                trim: true
            },
            linkedin: {
                type: String,
                trim: true
            },
            facebook: {
                type: String,
                trim: true
            },
            instagram: {
                type: String,
                trim: true
            }
        },

        // Subscription/Plan Information
        subscription: {
            plan: {
                type: String,
                enum: ['free', 'basic', 'premium', 'enterprise'],
                default: 'free'
            },
            startDate: {
                type: Date,
                default: Date.now
            },
            endDate: {
                type: Date
            },
            isActive: {
                type: Boolean,
                default: true
            }
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

// Virtual Properties
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(this.dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age
})

userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

// Indexes for better query performance
// userSchema.index({ email: 1 })
// userSchema.index({ username: 1 })
userSchema.index({ createdAt: -1 })
userSchema.index({ lastLogin: -1 })
userSchema.index({ 'subscription.plan': 1 })

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next()

    try {
        // Hash password with cost of 12
        const hashedPassword = await bcrypt.hash(this.password, 12)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

// Pre-save middleware to handle login attempts
userSchema.pre('save', function (next) {
    // If account is not locked and we're not modifying loginAttempts, skip
    if (!this.isModified('loginAttempts') && !this.isModified('lockUntil')) {
        return next()
    }

    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        }, next)
    }

    next()
})

// Instance Methods
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false
    return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.incrementLoginAttempts = function () {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        })
    }

    const updates = { $inc: { loginAttempts: 1 } }

    // If we have max attempts and no lock, lock the account
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // 2 hours
    }

    return this.updateOne(updates)
}

userSchema.methods.resetLoginAttempts = function () {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    })
}

userSchema.methods.generateVerificationToken = async function () {
    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex')

    this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex')
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    return token
}

userSchema.methods.generatePasswordResetToken = function () {
    const crypto = require('crypto')
    const token = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    return token
}

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    // Remove sensitive fields
    delete userObject.password
    delete userObject.emailVerificationToken
    delete userObject.emailVerificationExpires
    delete userObject.passwordResetToken
    delete userObject.passwordResetExpires
    delete userObject.loginAttempts
    delete userObject.lockUntil

    return userObject
}

// Static Methods
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase() })
}

userSchema.statics.findByUsername = function (username) {
    return this.findOne({ username: username })
}

userSchema.statics.findActiveUsers = function () {
    return this.find({ isActive: true })
}

userSchema.statics.findByRole = function (role) {
    return this.find({ role: role })
}

// Create and export the model
export const User = model('User', userSchema)

// module.exports = User