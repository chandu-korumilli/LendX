import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({

    // User who submits the report
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // What is being reported
    targetType: {
        type: String,
        enum: ["user", "item"],
        required: true
    },

    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    targetItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        default: null
    },

    // Reason for reporting
    reason: {
        type: String,
        enum: [
            "inappropriate",
            "fraud",
            "spam",
            "misleading",
            "other"
        ],
        required: true
    },

    description: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ""
    },

    // Report status
    status: {
        type: String,
        enum: ["pending", "resolved", "dismissed"],
        default: "pending"
    },

    // Admin resolution details
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    resolutionNote: {
        type: String,
        maxlength: 1000,
        default: ""
    },

    resolvedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

// Find reports by status
reportSchema.index({ status: 1, createdAt: -1 });

// Find reports submitted by a user
reportSchema.index({ reporter: 1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;