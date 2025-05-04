# FeedbackApp

Web application designed to help businesses collect verified, high-quality customer reviews in exchange for rewards. Customers scan a QR code, submit a review with a receipt photo, and receive a bonus from the business. Businesses access a dashboard with analytics, AI-powered insights, and control over reward settings.

---

## 📌 Project Overview

- **Type:** Two-sided web platform (client & business)
- **Goal:** Improve customer feedback quality and engagement through incentive-based reviews
- **Use Cases:** Restaurants, hotels, bath complexes, beauty salons, clinics, etc.
- **Current status:** MVP stage (in development)

---

## 🔧 Tech Stack

### Frontend:
- **Framework:** React.js
- **Build & Hosting:** Vercel / Netlify

### Backend:
- **Language:** Node.js
- **Database:** PostgreSQL
- **Storage:** Supabase Storage or Cloudinary (for receipt uploads)
- **OCR Service:** Google Cloud Vision API or Tesseract
- **AI Review Analysis:** OpenAI API

### Admin & DevOps:
- **Hosting:** TBD
- **Monitoring:** TBD
- **CI/CD:** GitHub Actions or Vercel auto-deploy

---

## 🧩 Core Features

### For Clients:
- Scan QR code and submit feedback
- Attach photo of receipt (proof of visit)
- Automatically get a reward (e.g., discount, gift)
- Bonus history and reward tracking in personal cabinet

### For Businesses:
- Business dashboard with review list and analytics
- Set up and manage rewards
- Track user feedback and satisfaction trends
- Export data and visualize top categories, themes, and sentiment

---

## 🧠 AI & Verification

- **Sentiment Analysis**: GPT analyzes each review (positive, negative, neutral)
- **Topic Detection**: GPT extracts key themes (e.g., service, cleanliness, pricing)
- **Review Quality Scoring**: Helps filter low-effort or irrelevant submissions
- **Receipt OCR**: Ensures review is valid with image-to-text check of receipt

---

## 🗄️ Database Schema Overview

- **Users** — clients and business owners
- **Businesses** — linked to owners, metadata
- **Reviews** — linked to users & businesses, includes text, rating, receipt URL, AI result
- **Bonuses** — defined by business, linked to conditions
- **UserBonuses** — logs bonuses earned and redeemed
- **Settings** — business-level configs and rules

---

## 📤 API Endpoints (TBD)

| Method | Endpoint               | Description                            |
|--------|------------------------|----------------------------------------|
| POST   | `/api/review`          | Submit a review                        |
| GET    | `/api/business/reviews`| Get business reviews                   |
| POST   | `/api/business/bonus`  | Create/update a reward                 |
| GET    | `/api/user/bonuses`    | List user's active & used bonuses      |

Full API schema coming soon.

---

## 🚀 MVP Development Plan

1. Set up PostgreSQL
2. Build QR-linked review submission form
3. Connect receipt upload + OCR
4. Integrate OpenAI for review validation
5. Build business dashboard (review list + stats)
6. Launch pilot with 2–3 test businesses

---

## 🔒 Security Considerations

- Review content and receipt data encrypted in storage
- Only businesses can access their own analytics
- GPT API requests sanitized
- OAuth2/Email login with JWT session tokens

---

## 🤝 License & Contact

**License:** MIT  
**Contact:** [as6850@rit.edu](mailto:as6850@rit.edu)  