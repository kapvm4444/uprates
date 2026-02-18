# Empire - Advanced Review Management System

Empire is a comprehensive platform designed for businesses to manage their online reviews efficiently. It provides an intuitive interface for gathering user feedback, generating valid, human-like reviews using AI, and directing users to post them on Google Maps.

## 🚀 Key Features

*   **Review Generation**: Leverages OpenAI to generate high-quality, personalized reviews based on user answers to specific questions.
*   **Business Management**: Admin panel to add, edit, and manage multiple businesses, each with custom questions and themes.
*   **Theming**: Dynamic color schemes for each business and the admin panel itself, supporting both Light and Dark modes.
*   **Dashboard**: Real-time analytics and system health monitoring for administrators.
*   **Security**: Role-based access control with secure login/logout functionality.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, Shadcn UI.
*   **Backend**: Convex (Real-time Database & Backend Actions), Clerk (Authentication - *Optional/Integration ready*), OpenAI API.
*   **Styling**: Lucide Icons, Custom Fonts (Gotham, Proxima Nova), OKLCH color spaces.

## 📦 Project Structure

```
src/
├── app/
│   ├── empire/             # Admin Panel
│   │   ├── _components/    # Shared Admin Components (Sidebar, Topbar)
│   │   ├── businesses/     # Business Management (CRUD)
│   │   ├── users/          # Admin User Management
│   │   └── ...
│   ├── ratings/            # Public Rating Page
│   │   └── [slug]/         # Dynamic Route per Business
│   │       └── _components/# Modular Steps (Questions, Options, Instructions)
│   └── ...
├── components/             # UI Library (Button, Card, Input, etc.)
└── lib/                    # Utilities
convex/                     # Backend Functions & Schema
```

## 🔧 Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/empire.git
    cd empire
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file and add your keys:
    ```env
    CONVEX_DEPLOYMENT=...
    NEXT_PUBLIC_CONVEX_URL=...
    OPENAI_API_KEY=sk-...
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🌟 Usage

1.  **Admin Login**: Navigate to `/empire/login` to access the dashboard.
2.  **Add Business**: Use the "Businesses" tab to add a new entity. Configure questions (e.g., "What did you order?").
3.  **Customer Flow**: Share the generated link (e.g., `/ratings/my-cafe`) with customers.
4.  **Review**: Customers answer questions -> AI generates 3 options -> Customer copies & posts.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.
