import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Sends a professional email using EmailJS.
 * @param {string} toEmail - Recipient email.
 * @param {string} toName - Recipient name.
 * @param {string} subject - Email subject.
 * @param {string} message - Email body content.
 * @returns {Promise} - Resolves on success, rejects on error.
 */
export const sendEmail = async (toEmail, toName, subject, message) => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        throw new Error('EmailJS credentials are missing. Please check your .env file.');
    }

    const templateParams = {
        to_email: toEmail,
        to_name: toName,
        subject: subject,
        message: message,
        from_name: 'Kone Academy Support',
        reply_to: 'phconsultgh@gmail.com'
    };

    try {
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        return response;
    } catch (error) {
        console.error('EmailJS Error:', error);
        throw error;
    }
};

/**
 * Sends bulk emails by looping through a list of recipients.
 * @param {Array} recipients - Array of { email, name } objects.
 * @param {string} subject - Email subject.
 * @param {string} message - Email body content.
 * @returns {Promise} - Resolves when all emails are processed.
 */
export const sendBulkEmail = async (recipients, subject, message) => {
    const results = {
        success: [],
        failed: []
    };

    for (const recipient of recipients) {
        try {
            await sendEmail(recipient.email, recipient.name || 'Subscriber', subject, message);
            results.success.push(recipient.email);
            // Optional: Add a small delay between sends to avoid rate limits if needed
            // await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            results.failed.push({ email: recipient.email, error: error.text || error.message });
        }
    }

    return results;
};
/**
 * Sends a notification for a new secure message.
 * @param {string} toEmail - Recipient email.
 * @param {string} toName - Recipient name.
 * @param {string} messageId - Unique ID of the secure message.
 * @param {string} accessCode - 6-digit access code for decryption.
 * @returns {Promise} - Resolves on success.
 */
export const sendSecureNotification = async (toEmail, toName, messageId, accessCode) => {
    const secureLink = `${window.location.origin}/secure/${messageId}`;
    const subject = "🔒 New Secure Message from Kone Academy";
    const body = `Hello ${toName},\n\nYou have received a new end-to-end encrypted message from Kone Academy.\n\nTo view your message safely, please click the link below and enter your unique access code when prompted.\n\n🔗 View Secure Message: ${secureLink}\n🔑 Access Code: ${accessCode}\n\nThis message is encrypted for your privacy and cannot be read by anyone else.\n\nBest regards,\nKone Academy Technical Team`;

    return sendEmail(toEmail, toName, subject, body);
};
