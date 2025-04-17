✅ Completed
- Google login via NextAuth
- Protected dashboard route
- User onboarding with MongoDB user doc creation
- URL + GA4 property management (frontend + backend)
- URL normalization + GA4 ID validation

🔜 Next Steps
1. GA4 Data Integration
- Connect to Google Analytics Data API
- Handle OAuth scopes and tokens (per user or via service account)
- ?Fetch metrics (like active users, bounce rate, etc.) for each tracked site

2. Analytics Dashboard UI
- Build visualizations (charts, graphs) using recharts or similar
- Create reusable analytics components per site
- Add filters (e.g., per URL, time range)

3. Alerts & Monitoring
- Add scheduled jobs (e.g., via CRON or background jobs)
- Detect traffic drops or spikes
- Send alerts via email or dashboard notifications

4. User Experience Enhancements
- Inline editing of site info (GA4 ID, URL)
- Site nickname/label support
- Search/filter tracked sites
- Improve dashboard polish/responsiveness

5. Production Hardening
- Rate limiting & input sanitization
- Better error handling (UI + backend)
- Add role-based access control if needed
- Deployment setup (Vercel, env vars, etc.)