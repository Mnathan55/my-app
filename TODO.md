# KYC Feature Implementation TODO

- [x] Update prisma/schema.prisma: Add KycStatus enum and kycStatus field to User model
- [ ] Run Prisma migration to apply schema changes (DATABASE_URL not set)
- [x] Create src/Components/KYCForm.tsx: Form with pan and adhar inputs, validation, and submit
- [x] Update src/Components/TabbedSection.tsx: Add "KYC" tab and render KYCForm
- [x] Create src/app/api/kyc/submit/route.ts: POST endpoint to save pan/adhar and set status to PENDING
- [x] Create src/app/api/admin/kyc/[userId]/approve/route.ts: PUT to set status to APPROVED
- [x] Create src/app/api/admin/kyc/[userId]/reject/route.ts: PUT to set status to REJECTED
- [x] Update src/app/admin/dashboard/AdminPage.tsx: Add KYC status column with approve/reject buttons
- [x] Update src/app/api/admin/users/route.ts: Include kycStatus in the response
