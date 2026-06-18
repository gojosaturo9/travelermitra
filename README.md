# TravelerMitra 🌍

Welcome to **TravelerMitra**, a full-stack web application designed to explore and manage travel listings like hotels, resorts, and vacation spots. Think of it as an Airbnb-inspired platform where users can browse destinations, list properties, and leave authentic reviews.

The primary goal of building this project was to implement core full-stack engineering concepts, including robust CRUD operations, secure user authentication, database relationships, and strict server-side validation.

---

## 🔥 Features & Capabilities

- **Full CRUD for Listings:** View destinations effortlessly. Authenticated users can create, update, and delete listings.
- **Dynamic Review System:** Leave 1-5 star ratings along with text reviews on destinations.
- **Secure Authentication:** Powered by `Passport.js` to manage secure user sign-ups, logins, and session states.
- **Schema Validation:** Server-side schema validation using `Joi` to prevent corrupt or invalid data entries.
- **Flash Messages:** Integrated `connect-flash` for clean operational alerts (success/error popups).
- **Modular Layouts:** Built using `ejs-mate` to maintain clean, reusable boilerplate templates (DRY principle).

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js (Modular Router Architecture)
- **Database:** MongoDB, Mongoose (Object Data Modeling)
- **Frontend:** EJS, HTML5, Custom CSS
- **Auth & Session:** Passport.js, Cookie-Parser, Express-Session
- **Validation:** Joi

---

## 📂 Project Architecture

A clean, production-ready breakdown of the codebase directory structure:

```text
travelermitra/
├── 📂 init/          # Data seeding script [index.js] & sample dataset [data.js]
├── 📂 models/        # Database Schemas [listing.js, reviews.js, user.js]
├── 📂 public/        # Static assets containing global [css/style.css] & [js/script.js]
├── 📂 routes/        # Express decoupled routers [listing.js, user.js]
├── 📂 utils/         # Async handlers [wrapAsync.js] & custom errors [ExpressError.js]
└── 📂 views/         # Presentation Layer (EJS Templates)
    ├── 📂 includes/  # Partials [navbar.ejs, footer.ejs, flash.ejs]
    ├── 📂 layouts/   # Core base frame [boilerplate.ejs]
    ├── 📂 listing/   # Listing templates [index.ejs, show.ejs, new.ejs, edit.ejs, error.ejs]
    └── 📂 users/     # Authentication views [login.ejs, signup.ejs]
├── 📄 app.js         # Core Application Entry Point & Orchestrator
├── 📄 middleware.js  # Operational Route Guards & Authentication Middleware
└── 📄 schema.js      # Central Joi Data Validation Schemas
```

---

## 💻 Local Installation & Setup

To get this project up and running locally, follow these simple steps:

### 1. Prerequisites
Ensure you have **Node.js** and **MongoDB** installed and running on your local machine.

### 2. Setup & Installation
```bash
git clone <your-repository-link>
cd travelermitra
npm install
```

### 3. Seed Database & Run
```bash
# Optional: Populate local DB with sample listings
node init/index.js

# Start the application server
node app.js     # Or 'nodemon app.js'
```

Open your favorite browser and visit: `http://localhost:8080/` 🚀

---

## 🗺️ Roadmap / Upcoming Milestones
- [ ] **Mapbox Integration:** Display interactive maps for listings.
- [ ] **Cloudinary Image Upload:** Transition from URL strings to cloud asset storage.
- [ ] **UI/UX Polishing:** Enhance components using modern frontend utilities like Tailwind/Bootstrap.

Feel free to open an issue or submit a Pull Request if you'd like to collaborate! Happy Coding! 💻🔥
