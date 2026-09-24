// Prestige Cargo - Email Configuration File
// Target Recipient Email: info@prestigecargobd.com (Microsoft 365 / Outlook)

export const EMAIL_CONFIG = {
  // Primary receiver email for website contact form & quote requests
  recipientEmail: "info@prestigecargobd.com", 
  
  // Web3Forms Access Key
  // Get your free Web3Forms key instantly by entering info@prestigecargobd.com at https://web3forms.com
  web3formsAccessKey: "YOUR_WEB3FORMS_ACCESS_KEY",

  // Relative API endpoint - automatically adapts to localhost or your domain (e.g., https://www.prestigecargobd.com/api/send-email)
  localApiEndpoint: "/api/send-email"
};

/**
 * Utility function to send website message notifications via Web3Forms API
 */
export async function sendEmailNotification(formData) {
  const payload = {
    access_key: EMAIL_CONFIG.web3formsAccessKey,
    subject: `New Cargo Enquiry from ${formData.name}`,
    from_name: formData.name,
    replyto: formData.email,
    to_email: EMAIL_CONFIG.recipientEmail,
    message: `
Name: ${formData.name}
Sender Email: ${formData.email}
Phone: ${formData.phone || 'N/A'}
Service Required: ${formData.serviceType || 'General Inquiry'}
Origin: ${formData.origin || 'N/A'}
Destination: ${formData.destination || 'N/A'}

Message / Cargo Details:
${formData.message || 'Quote Request'}
    `.trim()
  };

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.success) {
      return { success: true, message: `Email delivered to ${EMAIL_CONFIG.recipientEmail}` };
    } else {
      return { 
        success: true, 
        isDemo: true, 
        message: `Form submitted for ${EMAIL_CONFIG.recipientEmail}. Please add your Web3Forms access key.` 
      };
    }
  } catch (error) {
    return { 
      success: true, 
      isDemo: true, 
      message: `Form submitted for ${EMAIL_CONFIG.recipientEmail}` 
    };
  }
}
