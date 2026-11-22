# Privacy and security notes

- Public visitors can see the professional portfolio and published project summaries only.
- Customer enquiries and records must not be exposed on public pages.
- Admin access requires Firebase Authentication and an allow-listed UID document in the `admins` collection.
- Never place Firebase service-account keys, SMTP passwords or private API secrets in static frontend files.
- Do not cache admin pages, booking records or private customer data in the service worker.
- Ask permission before publishing customer names, logos, site photographs or identifiable service details.
- The public booking form currently hands off to WhatsApp; it does not upload the form or attached media to a server.
- The temporary example Firebase config is not connected to any project.
