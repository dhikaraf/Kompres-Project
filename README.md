# Kompres Frontend

Frontend untuk sistem **Kompres**, sebuah website yang memberikan rekomendasi kebugaran, nutrisi, makanan, dan latihan yang dipersonalisasi berdasarkan profil pengguna.

Project frontend ini dikembangkan menggunakan React.js dan Tailwind CSS dengan pendekatan component-based agar setiap bagian antarmuka dapat digunakan kembali dan mudah dikembangkan.

---

## Teknologi yang Digunakan

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Context API
- ESLint

---

## Fitur Frontend

Frontend saat ini memiliki beberapa fitur utama:

### Landing Page
- Informasi utama mengenai sistem
- Section fitur
- Section cara kerja
- Section tim
- Responsive navbar
- Hamburger menu pada perangkat mobile
- Smooth scrolling

### Login
- Input nama pengguna
- Input kata sandi
- Validasi input
- Fitur tampil/sembunyikan kata sandi
- Remember Me
- Navigasi menuju halaman Daftar

### Daftar
- Input nama pengguna
- Input email
- Input kata sandi
- Konfirmasi kata sandi
- Validasi input
- Validasi format email
- Validasi kecocokan kata sandi

### Onboarding
Sistem onboarding dibuat dalam bentuk multi-step wizard:

1. Tujuan kebugaran
2. Usia dan jenis kelamin
3. Berat dan tinggi badan

Input berat, tinggi, dan usia dapat dilakukan melalui:
- Tombol `+` dan `-`
- Input angka secara langsung menggunakan keyboard

### Dashboard
Dashboard merupakan halaman utama aplikasi dan terdiri dari:

- Greeting pengguna
- Rencana Nutrisi AI
- Rekomendasi Makanan AI
- Rekomendasi Latihan AI
- Horizontal scrolling card
- Tampilan "Lihat Semua" dalam bentuk grid

### Profile
- Nama pengguna
- Email
- Tujuan kebugaran
- Jenis kelamin
- Usia
- Berat badan
- Tinggi badan

---

## Struktur Project

```text
src/
├── assets/
│
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── InputField.jsx
│   │   ├── Counter.jsx
│   │   └── Card.jsx
│   │
│   ├── layout/
│   │   └── Navbar.jsx
│   │
│   └── dashboard/
│       ├── ProgressBar.jsx
│       ├── FoodCard.jsx
│       └── WorkoutCard.jsx
│
├── layouts/
│   ├── AuthLayout.jsx
│   ├── OnboardingLayout.jsx
│   └── DashboardLayout.jsx
│
├── pages/
│   ├── Landing/
│   │   └── LandingPage.jsx
│   │
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── Onboarding/
│   │   ├── Wizard.jsx
│   │   ├── Goal.jsx
│   │   ├── AgeGender.jsx
│   │   └── WeightHeight.jsx
│   │
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   │
│   └── Profile/
│       └── Profile.jsx
│
├── context/
│   └── UserContext.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css
