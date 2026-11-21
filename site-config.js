// ONE place to edit contact details and feature switches.
window.SITE = {
  name: "Alok",
  whatsapp: "918660581728",            // digits only, with country code
  phoneDisplay: "+91 86605 81728",
  email: "hello@example.com",          // TEMPORARY demo address - replace with a real mailbox
  emailIsDemo: true,                   // set false once the email above is real
  firebaseEnabled: false,              // set true AFTER creating config/firebase-config.js (see FIREBASE-SETUP.md)
  // Optional EmailJS notification (public keys only). Leave empty to skip.
  emailjs: { serviceId: "", templateId: "", publicKey: "" },
  // Public logo slots are managed from the admin dashboard once Firebase is on.
};
