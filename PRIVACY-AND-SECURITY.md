# Privacy and security
- Public visitors can only **create** a validated booking (size/field limits in `firestore.rules`) and upload one image under 5 MB. They cannot read bookings or photos.
- Only users listed in the `admins` collection can read bookings, edit projects, or write logos.
- Customer names for projects live in `projects/{id}/private/details` (admin only). A name appears publicly only if “Show customer name publicly” is set.
- Empty/unpublished projects are never readable by the public.
- No service-account keys are in this code. Firebase web config values are public identifiers; protect with rules + App Check.
- The service worker never caches `/admin/` or Firebase/EmailJS requests.
- Get customer permission before showing any logo, name or photo.
- Honest limits: WhatsApp opens a pre-filled chat (no automatic sending); push notifications are not implemented.
