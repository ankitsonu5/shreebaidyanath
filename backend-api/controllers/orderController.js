const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

exports.createOrder = async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, paymentMethod, totalAmount } =
      req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No order items" });
    }
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Shipping address is incomplete" });
    }

    const order = new Order({
      userId: userId || undefined,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalAmount,
      orderStatus: "Processing",
    });

    await order.save();

    // Send Confirmation Email
    try {
      const baseUrl = process.env.BASE_URL || "http://localhost:8080";

      const itemsHtml = orderItems
        .map((item) => {
          // Fix image URL for email clients - Replace backslashes with forward slashes
          let imagePath = item.image;
          if (imagePath) {
            imagePath = imagePath.replace(/\\/g, "/");
          }

          const imageUrl = imagePath.startsWith("http")
            ? imagePath
            : `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;

          const itemSubtotal = item.price * item.quantity;

          return `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
                <div style="display: flex; align-items: center;">
                  <img src="${imageUrl}" alt="${item.name}" width="60" height="60" style="border-radius: 8px; object-fit: cover; margin-right: 15px; border: 1px solid #f0f0f0;">
                  <span style="font-weight: 500; font-size: 14px; color: #2d3748;">${item.name}</span>
                </div>
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: center; color: #4a5568; font-size: 14px;">${item.quantity}</td>
              <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; color: #4a5568; font-size: 14px;">₹${item.price.toLocaleString()}</td>
              <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; color: #2d3748; font-weight: 600; font-size: 14px;">₹${itemSubtotal.toLocaleString()}</td>
            </tr>
          `;
        })
        .join("");

      const tax = 0; // Assuming 0 for now or calculate if needed
      const shippingCharge = 0; // Assuming Free for now
      const subtotal = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed;">
            
            <!-- Header -->
            <div style="background-color: #c53030; padding: 30px 20px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">SHREE BAIDYANATH</h1>
              <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Namaste! Your order is confirmed.</p>
            </div>

            <div style="padding: 30px 25px;">
              <!-- Basic Info -->
              <div style="display: flex; flex-wrap: wrap; margin-bottom: 30px; border: 1px solid #edf2f7; border-radius: 10px; overflow: hidden;">
                <div style="flex: 1; min-width: 250px; padding: 20px; background-color: #fffaf0;">
                  <h3 style="margin-top: 0; color: #744210; font-size: 16px; border-bottom: 2px solid #fbd38d; padding-bottom: 8px; display: inline-block;">BASIC INFO</h3>
                  <table style="width: 100%; font-size: 14px; border-spacing: 5px;">
                    <tr><td style="color: #718096; width: 120px;">Customer Name:</td><td style="font-weight: 600; color: #2d3748;">${shippingAddress.fullName}</td></tr>
                    <tr><td style="color: #718096;">Order ID:</td><td style="font-weight: 600; color: #2d3748;">#${order._id.toString().slice(-8).toUpperCase()}</td></tr>
                    <tr><td style="color: #718096;">Order Date:</td><td style="font-weight: 600; color: #2d3748;">${orderDate}</td></tr>
                    <tr><td style="color: #718096;">Payment Method:</td><td style="font-weight: 600; color: #2d3748;">${paymentMethod}</td></tr>
                  </table>
                </div>
              </div>

              <!-- Shipping Details -->
              <div style="margin-bottom: 35px; background-color: #f8fafc; border-radius: 10px; padding: 20px; border: 1px solid #e2e8f0;">
                <h3 style="margin-top: 0; color: #2c5282; font-size: 16px; margin-bottom: 12px;">SHIPPING DETAILS</h3>
                <div style="font-size: 15px; color: #4a5568; line-height: 1.6;">
                  <p style="margin: 0; font-weight: 600; color: #2d3748;">${shippingAddress.fullName}</p>
                  <p style="margin: 4px 0;">${shippingAddress.address}</p>
                  <p style="margin: 4px 0;">${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
                  <p style="margin: 4px 0;"><strong>Phone:</strong> ${shippingAddress.phone}</p>
                </div>
              </div>

              <!-- Ordered Items -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin-top: 0; color: #2d3748; font-size: 16px; margin-bottom: 15px;">ORDERED ITEMS</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f7fafc;">
                      <th style="padding: 12px; text-align: left; font-size: 12px; color: #718096; border-bottom: 2px solid #edf2f7; text-transform: uppercase;">Product</th>
                      <th style="padding: 12px; text-align: center; font-size: 12px; color: #718096; border-bottom: 2px solid #edf2f7; text-transform: uppercase;">Qty</th>
                      <th style="padding: 12px; text-align: right; font-size: 12px; color: #718096; border-bottom: 2px solid #edf2f7; text-transform: uppercase;">Price</th>
                      <th style="padding: 12px; text-align: right; font-size: 12px; color: #718096; border-bottom: 2px solid #edf2f7; text-transform: uppercase;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
              </div>

              <!-- Price Summary -->
              <div style="margin-left: auto; width: 100%; max-width: 250px; background-color: #fff; border: 1px solid #edf2f7; border-radius: 8px; padding: 15px;">
                <h3 style="margin-top: 0; color: #2d3748; font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">PRICE SUMMARY</h3>
                <table style="width: 100%; border-spacing: 0;">
                  <tr style="font-size: 14px; color: #4a5568;">
                    <td style="padding: 4px 0;">Items Total:</td>
                    <td style="text-align: right;">₹${subtotal.toLocaleString()}</td>
                  </tr>
                  <tr style="font-size: 14px; color: #4a5568;">
                    <td style="padding: 4px 0;">Shipping:</td>
                    <td style="text-align: right; color: #38a169;">Free</td>
                  </tr>
                  <tr style="font-size: 14px; color: #4a5568;">
                    <td style="padding: 4px 0;">Tax:</td>
                    <td style="text-align: right;">₹${tax}</td>
                  </tr>
                  <tr style="font-size: 16px; font-weight: 700; color: #c53030;">
                    <td style="padding: 10px 0 0;">GRAND TOTAL:</td>
                    <td style="padding: 10px 0 0; text-align: right;">₹${totalAmount.toLocaleString()}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f7fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #edf2f7;">
              <h4 style="margin: 0 0 10px; color: #2d3748;">SUPPORT CONTACT</h4>
              <p style="margin: 5px 0; font-size: 14px; color: #4a5568;">
                Email: <a href="mailto:support@shreebaidyanath.com" style="color: #c53030; text-decoration: none;">support@shreebaidyanath.com</a>
              </p>
              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 18px; color: #2d3748; font-weight: 600;">THANK YOU FOR YOUR PURCHASE!</p>
                <p style="margin: 5px 0 0; color: #718096; font-size: 14px;">Visit our website for more premium Ayurvedic products.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      console.log(
        "Attempting to send enhanced email to:",
        shippingAddress.email || req.body.email,
      );
      await sendEmail({
        email: shippingAddress.email || req.body.email, // Use shipping email or req body email
        subject: "Order Placed Successfully - Shree Baidyanath",
        html: emailHtml,
      });
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Email sending failed. Error Details:", emailError.message);
      if (emailError.response)
        console.error("SMTP Response:", emailError.response);
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "name email",
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true },
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order, message: "Status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Security: Only order owner or admin can cancel
    if (req.user.role !== "admin" && order.userId?.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (order.orderStatus !== "Processing") {
      return res
        .status(400)
        .json({ success: false, message: "Order cannot be cancelled now" });
    }

    order.orderStatus = "Cancelled";
    order.cancelReason = req.body.reason || "User Cancelled";
    order.cancelledAt = new Date();

    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
