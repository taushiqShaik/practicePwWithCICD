// utils/testEmail.js
const fs = require("fs");
const nodemailer = require("nodemailer");

async function testEmailSending() {
  try {
    const testData = JSON.parse(fs.readFileSync(`./utils/data.json`, `utf-8`));

    console.log("📧 Testing email configuration...");
    console.log("Gmail User:", testData.gmail_user);
    console.log("Recipients:", testData.recipient_emails);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: testData.gmail_user,
        pass: testData.gmail_app_password,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("✅ Gmail connection verified!");

    // Send test email
    const mailOptions = {
      from: testData.gmail_user,
      to: testData.recipient_emails.join(", "),
      subject: "🧪 Test Email - Playwright Results Setup",
      html: `
        <h2>✅ Email Configuration Test Successful!</h2>
        <p>Your Playwright test results email setup is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", result.messageId);
  } catch (error) {
    console.error("❌ Email test failed:", error.message);

    if (error.code === "EAUTH") {
      console.log("\n🔧 Authentication failed. Please check:");
      console.log("1. Your Gmail app password is correct (16 characters)");
      console.log(
        "2. 2-Factor Authentication is enabled on your Gmail account"
      );
      console.log("3. App password was generated correctly");
    }
  }
}

testEmailSending();
