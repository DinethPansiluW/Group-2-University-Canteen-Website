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
- 🔐 Student/Staff Registration and Login authentication system (`html/register.html`, `html/login.html`)
- 👤 User Profile and Order History tracking (`html/profile.html`, `html/orders.html`)
- ⭐ Canteen Services & Features showcase (`html/features.html`)
- 🕒 Canteen opening hours, location, and general information (`html/about.html`)
- 📨 Contact page with JavaScript form validation (`html/contact.html`)
- 🎨 Modular CSS stylesheets tailored per page for maintainable styling

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
| Home | `index.html` | Welcome section, highlights, and quick links |
| About | `html/about.html` | Canteen information, opening hours, location, and background |
| Menu | `html/menu.html` | Food items and prices with category filter, search, and ordering |
| Services / Features | `html/features.html` | Canteen facilities, special services, and highlights |
| Contact | `html/contact.html` | Contact details and feedback/enquiry form |
| Login | `html/login.html` | User login interface and validation |
| Registration | `html/register.html` | New user account registration form |
| Orders | `html/orders.html` | View and manage placed food orders |
| Profile | `html/profile.html` | View and manage user profile details |

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
```

---

## 🚀 Getting Started

No installation or build step is required.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Group-2-University-Canteen-Website
   ```

2. **Open the website**
   - Double-click `index.html` to open it in your browser, **or**
   - In VS Code, right-click `index.html` and choose **Open with Live Server** (recommended).

---

## 👥 Team Members and Responsibilities

| Student | Role | Name | SC Number | Responsibility | Branch |
|---------|------|------|-----------|----------------|--------|
| Student 1 | Team Leader | D.P. Wickramasinghe | SC/CS/2025/14962 | Repository management, shared layout (`shared/`), Menu/Orders/Profile integration, PR reviews and merging | `main` (reviews all PRs) |
| Student 2 | Member | M. Poojani Hirunima | SC/CS/2025/14965 | Home page (`index.html`, `css/home.css`, `js/home.js`) | `feature/home` |
| Student 3 | Member | W.W.M.I.H. Weerasinghe | SC/CS/2025/14967 | About / Information page (`html/about.html`, `css/about1.css`, `css/about2.css`) | `feature/about` |
| Student 4 | Member | P.K.M. Mihiranga | SC/CS/2025/14963 | Login, Registration & Services pages (`html/login.html`, `html/register.html`, `html/features.html`) | `feature/login`, `feature/registration`, `feature/services` |
| Student 5 | Member | R.M.S.P.A. Bandara | SC/CS/2025/14964 | Contact page (`html/contact.html`, `js/script.js`) | `feature/contact` |

---

## 🔀 Git and GitHub Workflow

1. **Create repository** (Team Leader), named `Group-2-University-Canteen-Website`.
2. **Add collaborators**: the Team Leader invites the other four members, who accept the invitation.
3. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Group-2-University-Canteen-Website
   git branch
   ```
4. **Create and switch to a feature branch**
   ```bash
   git switch -c feature/home
   git switch -c feature/about
   git switch -c feature/services
   git switch -c feature/login
   git switch -c feature/registration
   git switch -c feature/contact
   ```
5. **Develop** the assigned pages using HTML, CSS, and JavaScript.
6. **Commit and push**
   ```bash
   git status
   git add .
   git commit -m "Add assigned feature page"
   git push -u origin <branch-name>
   ```
7. **Create a Pull Request** from your feature branch to `main` with a clear title and short description.
8. **Review and merge**: the Team Leader reviews each Pull Request and merges approved work into `main`.
9. **Update local repository**
   ```bash
   git switch main
   git pull origin main
   ```
10. **Verify** that all members' contributions are present and working together seamlessly.

---

## ⚔️ Merge Conflict Activity

To practise conflict resolution, two members edit the **same line** of a common file (e.g. `shared/layout.js` or `css/style.css`) in two different branches. After merging the first branch, the second Pull Request shows a conflict, which is resolved as follows:

1. Open the conflicted file in VS Code.
2. Resolve using the **Merge Editor** (Accept Current / Incoming / Both) or edit manually, removing the `<<<<<<<`, `=======` and `>>>>>>>` markers.
3. Complete the merge:
   ```bash
   git add .
   git commit -m "Resolve merge conflict"
   git push
   ```

---

## 📝 Commit Message Guidelines

Use short, clear, present-tense messages:

```text
Add home page layout and styles
Add shared navigation bar and footer
Style menu cards with CSS
Add menu search and filter script
Add login and registration validation
Fix broken link on contact page
Resolve merge conflict
```

---

## 📄 License

This project was created for educational purposes as part of the **CSC1153** laboratory assignments at the University of Ruhuna.
