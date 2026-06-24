const Contact = require("../models/contact");
const sendEmail = require("../utils/sendEmail");

exports.createContact = async (req, res) => {
  try {
    const data = req.body.data || req.body;
    const { name, email, mobile, phone, subject, message } = data;

    if (!name || !email || !(mobile || phone) || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, email, mobile, subject, message.",
      });
    }

    const contact = new Contact({
      name,
      email,
      mobile: mobile || phone,
      subject,
      message,
    });

    await contact.save();
    res.status(201).json({ success: true, contact });

    // Send Email Notifications (Non-blocking background process)
    // 1. Attempt Email to Admin/Store Manager
    try {
      const adminEmail = process.env.EMAIL_USER;
      if (adminEmail) {
        const adminHtml = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                        <div style="background-color: #b7791f; padding: 20px; text-align: center; color: #ffffff;">
                            <h2 style="margin: 0;">New Contact Inquiry Received</h2>
                        </div>
                        <div style="padding: 20px;">
                            <p>You have received a new message from the Shree Baidyanath Contact Us form.</p>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Mobile:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${mobile || phone}</td></tr>
                                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${subject}</td></tr>
                                <tr style="background-color: #f9f9f9;"><td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 10px;">${message}</td></tr>
                            </table>
                        </div>
                    </div>
                `;
        sendEmail({
          email: adminEmail,
          subject: `Contact Inquiry: ${subject} from ${name}`,
          html: adminHtml,
        })
          .then(() => console.log("Admin contact email sent (background)."))
          .catch((err) =>
            console.error(
              "ADMIN CONTACT EMAIL FAILED (background):",
              err.message,
            ),
          );
      }
    } catch (error) {
      console.error(
        "Critical error preparing Admin contact email:",
        error.message,
      );
    }

    // 2. Attempt Confirmation Email to Customer
    try {
      if (email) {
        const customerHtml = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                        <div style="background-color: #c53030; padding: 20px; text-align: center; color: #ffffff;">
                            <h2 style="margin: 0;">We have received your message!</h2>
                        </div>
                        <div style="padding: 20px;">
                            <p>Dear ${name},</p>
                            <p>Thank you for reaching out to Shree Baidyanath. We have received your query regarding "<strong>${subject}</strong>".</p>
                            <p>Our support team will review your message and get back to you as soon as possible.</p>
                            <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-left: 4px solid #c53030; font-style: italic;">
                                "${message}"
                            </div>
                            <p>Stay Healthy,<br><strong>Shree Baidyanath Team</strong></p>
                        </div>
                    </div>
                `;
        sendEmail({
          email: email,
          subject: "Thank you for contacting Shree Baidyanath",
          html: customerHtml,
        })
          .then(() =>
            console.log(
              "Customer contact confirmation email sent (background).",
            ),
          )
          .catch((err) =>
            console.error(
              "CUSTOMER CONTACT EMAIL FAILED (background):",
              err.message,
            ),
          );
      }
    } catch (error) {
      console.error(
        "Critical error preparing Customer contact email:",
        error.message,
      );
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact inquiry not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Contact inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ success: false, message: "Reply message is required" });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact inquiry not found" });
    }

    const replyHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #c53030; padding: 20px; text-align: center; color: #ffffff;">
                <h2 style="margin: 0;">Reply from Shree Baidyanath</h2>
            </div>
            <div style="padding: 20px;">
                <p>Dear ${contact.name},</p>
                <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-left: 4px solid #c53030;">
                    ${replyMessage.replace(/\n/g, '<br>')}
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">On ${new Date(contact.createdAt).toLocaleDateString()}, you wrote:</p>
                <div style="font-size: 13px; color: #555; background-color: #f0f0f0; padding: 10px; border-radius: 5px; font-style: italic;">
                    "${contact.message}"
                </div>
                <p style="margin-top: 20px;">Stay Healthy,<br><strong>Shree Baidyanath Team</strong></p>
            </div>
        </div>
    `;

    await sendEmail({
      email: contact.email,
      subject: `Re: ${contact.subject}`,
      html: replyHtml,
    });

    res.status(200).json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
