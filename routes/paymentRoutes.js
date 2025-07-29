import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
    const { resumeId } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Resume Download",
                    },
                    unit_amount: 199, // $1.99
                },
                quantity: 1,
            }],
            mode: "payment",
            success_url: `http://localhost:5173/my-resumes?paidResumeId=${resumeId}`,
            cancel_url: `http://localhost:5173/my-resumes`,
        });

        res.json({ id: session.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
