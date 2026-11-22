# 🍽️ University Canteen Website

**Group 02 | CSC1153 – Laboratory Assignment: Collaborative Website Development Using Git and GitHub**

A multi-page web application for the University of Ruhuna canteen that displays canteen information, food menus, prices, user authentication, and order management. Built purely with **HTML5, CSS3, and Vanilla JavaScript**—with no external frameworks or backend dependencies. The project was developed collaboratively by a group of five students using Git and GitHub (feature branches, Pull Requests, code reviews, and merges).

---

## 📖 Table of Contents

- [Project Objectives](#-project-objectives)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pages](#-pages)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Team Members and Responsibilities](#-team-members-and-responsibilities)
- [Git and GitHub Workflow](#-git-and-github-workflow)
- [Merge Conflict Activity](#-merge-conflict-activity)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [License](#-license)

---

## 🎯 Project Objectives

**Website Objectives**
- Provide students and staff with clear canteen information (location, opening hours, contact details).
- Display food menus by category along with prices and ordering functionality.
- Support student/staff account registration, login, profile viewing, and order tracking.
- Offer a clean, consistent, and responsive interface across all pages.

**Learning Objectives (Git and GitHub)**
- Create and manage a GitHub repository (`Group-2-University-Canteen-Website`) and add collaborators.
- Clone the repository and work independently on dedicated feature branches.
- Make clean commits and push changes to GitHub.
- Create, review, and merge Pull Requests into `main`.
- Identify and resolve merge conflicts.

---

## ✨ Features

- 🧭 Shared dynamic navigation bar and footer injected across all pages (`shared/layout.js` & `shared/layout.css`)
- 📋 Interactive Menu page with categories, pricing, filtering, and search (`js/menu.js`)
- 🔐 Student/Staff Registration and Login authentication system (`html/register.html`, `html/login.html`)[cite: 1]
- 👤 User Profile and Order History tracking (`html/profile.html`, `html/orders.html`)[cite: 1]
- ⭐ Canteen Services & Features showcase (`html/features.html`)[cite: 1]
- 🕒 Canteen opening hours, location, and general information (`html/about.html`)[cite: 1]
- 📨 Contact page with JavaScript form validation (`html/contact.html`)[cite: 1]
- 🎨 Modular CSS stylesheets tailored per page for maintainable styling[cite: 1]

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5      | Semantic page structure and content |
| CSS3       | Modular page styling, layout (Flexbox/Grid), and responsiveness |
| JavaScript | Shared layout rendering, menu filtering/search, authentication, order management, and form validation |
| Git        | Local version control |
| GitHub     | Remote repository hosting, branch management, Pull Requests, and code review |

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html`[cite: 1] | Welcome section, highlights, and quick links |
| About | `html/about.html`[cite: 1] | Canteen information, opening hours, location, and background |
| Menu | `html/menu.html`[cite: 1] | Food items and prices with category filter, search, and ordering |
| Services / Features | `html/features.html`[cite: 1] | Canteen facilities, special services, and highlights |
| Contact | `html/contact.html`[cite: 1] | Contact details and feedback/enquiry form |
| Login | `html/login.html`[cite: 1] | User login interface and validation |
| Registration | `html/register.html`[cite: 1] | New user account registration form |
| Orders | `html/orders.html`[cite: 1] | View and manage placed food orders |
| Profile | `html/profile.html`[cite: 1] | View and manage user profile details |

---

## 📂 Project Structure

```text
Group-2-University-Canteen-Website/
├── .git/
├── assets/
│   ├── 1.jpg
│   └── ruhuna-2.png
├── css/
│   ├── about1.css
│   ├── about2.css
│   ├── features.css
│   ├── home.css
│   ├── login.css
│   ├── menu.css
│   ├── orders.css
│   ├── profile.css
│   ├── register.css
│   └── style.css
├── html/
│   ├── about.html
│   ├── contact.html
│   ├── features.html
│   ├── login.html
│   ├── menu.html
│   ├── orders.html
│   ├── profile.html
│   └── register.html
├── js/
│   ├── common.js
│   ├── features.js
│   ├── home.js
│   ├── login.js
│   ├── menu.js
│   ├── orders.js
│   ├── profile.js
│   ├── register.js
│   └── script.js
├── shared/
│   ├── layout.css
│   └── layout.js
├── index.html
└── README.md
```[cite: 1]

---

## 🚀 Getting Started

No installation or build step is required.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Group-2-University-Canteen-Website
