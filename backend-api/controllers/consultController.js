const Consult = require("../models/consult");
const sendEmail = require("../utils/sendEmail");

exports.createConsult = async (req, res) => {
  try {
    const data = req.body.data || req.body;
    const { name, email, mobile, phone, problem } = data;

    const consult = new Consult({
      name,
      email,
      mobile: mobile || phone,
      problem,
    });

    await consult.save();
    res.status(201).json({ success: true, consult });

    // Send Email Notifications (Non-blocking background process)
    // 1. Attempt Email to Doctor/Admin
    try {
      const adminEmail = process.env.EMAIL_USER;
      if (adminEmail) {
        const doctorHtml = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                        <div style="background-color: #2f855a; padding: 20px; text-align: center; color: #ffffff;">
                            <h2 style="margin: 0;">New Consultation Request</h2>
                        </div>
                        <div style="padding: 20px;">
                            <p>You have received a new consultation booking.</p>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Patient:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Mobile:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${mobile || phone}</td></tr>
                                <tr style="background-color: #f9f9f9;"><td style="padding: 10px; font-weight: bold; vertical-align: top;">Problem:</td><td style="padding: 10px;">${problem}</td></tr>
                            </table>
                        </div>
                    </div>
                `;
        // Not using await here so it runs in background
        sendEmail({
          email: adminEmail,
          subject: `Booking Alert: ${name}`,
          html: doctorHtml,
        })
          .then(() => console.log("Doctor email sent (background)."))
          .catch((err) =>
            console.error("DOCTOR EMAIL FAILED (background):", err.message),
          );
      }
    } catch (error) {
      console.error(
        "Critical error preparation for Doctor email:",
        error.message,
      );
    }

    // 2. Attempt Confirmation Email to Patient
    try {
      if (email) {
        const patientHtml = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                        <div style="background-color: #c53030; padding: 20px; text-align: center; color: #ffffff;">
                            <h2 style="margin: 0;">Booking Confirmed</h2>
                        </div>
                        <div style="padding: 20px;">
                            <p>Dear ${name},</p>
                            <p>We have received your consultation request. Our expert will contact you shortly.</p>
                            <p>Stay Healthy,<br><strong>Shree Baidyanath Team</strong></p>
                        </div>
                    </div>
                `;
        // Not using await here so it runs in background
        sendEmail({
          email: email,
          subject: "Consultation Received - Shree Baidyanath",
          html: patientHtml,
        })
          .then(() => console.log("Patient email sent (background)."))
          .catch((err) =>
            console.error("PATIENT EMAIL FAILED (background):", err.message),
          );
      }
    } catch (error) {
      console.error(
        "Critical error preparation for Patient email:",
        error.message,
      );
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consult.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consult.findByIdAndDelete(id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }
    res.status(200).json({ success: true, message: "Consultation deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
