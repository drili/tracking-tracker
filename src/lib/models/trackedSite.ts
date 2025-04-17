import mongoose, { Schema, models, model } from "mongoose";

const TrackedSiteSchema = new Schema({
    userId: { type: String, required: true },
    url: { type: String, required: true },
    ga4: { type: String, required: true },
    ga4PropertyId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    isGTMFound: { type: Boolean, default: null },
    lastCheckedAt: { type: Date },
    statusMessage: { type: String }
})

export const TrackedSite = models.TrackedSite || model("TrackedSite", TrackedSiteSchema)