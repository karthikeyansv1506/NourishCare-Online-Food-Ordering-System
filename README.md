\# NourishCare – Online Food Ordering System



NourishCare is a full-stack web application designed for healthy food ordering and delivery management. It allows users to browse healthy food items, add items to a cart, place orders, and track their order status. An admin dashboard is provided for managing orders and delivery status.



\## 🎯 Problem Statement



Traditional food ordering systems may not provide a focused platform for healthy food choices along with simple order and delivery management.



NourishCare provides a centralized web-based solution for healthy food ordering, customer order tracking, and administrative order management.



\## ✨ Features



\### 👤 User Features

\- User registration and login

\- Browse healthy food items

\- View food details and prices

\- Add items to cart

\- Increase or decrease item quantities

\- Checkout with delivery address

\- Cash on Delivery option

\- View placed orders

\- Track order status



\### 🛠️ Admin Features

\- Admin authentication

\- View customer orders

\- Assign delivery

\- Update order status

\- Manage the order delivery process



\### 📦 Order Status



Orders progress through the following stages:



`Pending → Assigned to Delivery → Out for Delivery → Delivered`



\## 🛠️ Technology Stack



\### Frontend

\- React.js

\- Vite

\- JavaScript

\- HTML

\- CSS

\- Axios



\### Backend

\- Node.js

\- Express.js

\- Sequelize ORM



\### Database

\- SQLite



\## 📁 Project Structure



```text

NourishCare-Online-Food-Ordering-System/

│

├── backend/

│   ├── models/

│   ├── routes/

│   ├── database.js

│   ├── server.js

│   ├── package.json

│   └── package-lock.json

│

├── client/

│   ├── public/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── assets/

│   │   ├── App.jsx

│   │   ├── App.css

│   │   └── api.js

│   ├── package.json

│   └── package-lock.json

│

└── .gitignore

