import resumeModel from "../models/resumeModel.js"
// Consistent error handler
const handleError = (res, err, message = 'Server error') => {
    console.error(message, err);
    res.status(500).json({ success: false, message, error: err?.message || err });
};


export const fetchResume = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required." });
        }
        const allResume = await resumeModel.find({ userId });
        res.status(200).json({ success: true, message: "All User's Resume fetched successfully", data: allResume });
    } catch (err) {
        handleError(res, err, "Error fetching resumes");
    }
}

export const fetchSingleResume = async (req, res) => {
    try {
        const { query: { id } } = req;
        if (!id) {
            return res.status(400).json({ success: false, message: "Resume id is required." });
        }
        const singleResume = await resumeModel.findById(id);
        if (!singleResume) {
            return res.status(404).json({ success: false, message: "Resume not found." });
        }
        res.status(200).json({ success: true, message: "Single resume fetched successfully", data: singleResume });
    } catch (err) {
        handleError(res, err, "Error fetching single resume");
    }
}

export const createResume = async (req, res) => {
    try {
        const { userId, template, ...rest } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required." });
        }
        if (!template) {
            return res.status(400).json({ success: false, message: "template is required." });
        }
        // Check if resume exists for this user and template
        let existingResume = await resumeModel.findOne({ userId, template });
        if (existingResume) {
            // Update existing resume
            Object.assign(existingResume, rest);
            await existingResume.save();
            return res.status(200).json({ success: true, message: "Resume updated successfully", data: existingResume });
        } else {
            // Create new resume
            const newResume = await resumeModel.create({ ...rest, userId, template });
            return res.status(201).json({ success: true, message: "Resume created successfully", data: newResume });
        }
    } catch (err) {
        handleError(res, err, "Error creating or updating resume");
    }
}

export const updateResume = async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;
        if (!_id) {
            return res.status(400).json({ success: false, message: "Resume _id is required." });
        }
        const updatedResume = await resumeModel.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedResume) {
            return res.status(404).json({ success: false, message: "Resume not found." });
        }
        res.status(200).json({ success: true, message: "Resume updated successfully", data: updatedResume });
    } catch (err) {
        handleError(res, err, "Error updating resume");
    }
}

export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Resume id is required." });
        }
        const deletedResume = await resumeModel.findByIdAndDelete(id);
        if (!deletedResume) {
            return res.status(404).json({ success: false, message: "Resume not found." });
        }
        res.status(200).json({ success: true, message: "Resume deleted successfully" });
    } catch (err) {
        handleError(res, err, "Error deleting resume");
    }
}

export const razerPayment = async (req, res) => {
    try {
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required for payment." });
        }
        const options = {
            amount,
            currency: "INR",
            receipt: "receipt#1"
        };
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        handleError(res, err, "Error processing Razorpay payment");
    }
}
