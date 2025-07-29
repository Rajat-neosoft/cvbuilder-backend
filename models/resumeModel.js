import mongoose from 'mongoose';

const ResumeSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    template: { type: String, required: true },

    resumeName: { type: String, required: true },

    basicDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        intro: { type: String },
        image: { type: String }
    },

    education: [
        {
            _id: false,
            degree: { type: String, required: true },
            institution: { type: String, required: true },
            percentage: { type: String },
            startYear: { type: String },
            endYear: { type: String },
            location: { type: String }
        }
    ],

    experience: [
        {
            _id: false,
            organization: { type: String, required: true },
            joiningLocation: { type: String, required: true },
            position: { type: String, required: true },
            CTC: { type: String },
            joiningDate: { type: String },
            leavingDate: { type: String },
            technologies: [String]
        }
    ],

    project: [
        {
            _id: false,
            title: { type: String, required: true },
            teamSize: { type: Number },
            duration: { type: String },
            technologies: [String],
            description: { type: String, required: true }
        }
    ],

    skill: [
        {
            _id: false,
            skillName: { type: String, required: true },
            level: { type: Number, min: 0, max: 100, required: true }
        }
    ],

    socialProfile: [
        {
            _id: false,
            platform: { type: String },
            url: { type: String }
        }
    ],

    fontConfig: {
        nameSize: Number,
        introSize: Number,
        contactSize: Number,
        headingSize: Number,
        itemSize: Number,
        // minHeight: String,
        bodyFont: String
    }

})

const resumeModel = mongoose.model("resume", ResumeSchema)

export default resumeModel 