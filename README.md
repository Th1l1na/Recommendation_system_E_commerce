# Product Recommendation System

The **Product Recommendation System** is designed to provide personalized product suggestions based on user preferences, search queries, and seasonal trends. Built using Flask and connected to a MySQL database, this system offers users an intuitive web interface for receiving product recommendations, managing profiles, and creating wishlists.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)
- [License](#license)

## Introduction

This system provides product recommendations tailored to individual user preferences, seasonal trends, and search keywords. Users can manage their profile, update preferences, and create wishlists to save products for future reference.

## Features

### User Registration & Preferences:
- Users can sign up and create an account.
- Preferences are set during registration, allowing the system to generate personalized recommendations.

### Search & Recommendations:
- Users can search for products using keywords.
- Personalized recommendations based on user preferences and seasonal trends are shown on the dashboard.

### Wishlist:
- Users can add products to a wishlist for future reference.

### Profile Management:
- Users can update their preferences at any time, dynamically adjusting the recommendations.

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: MySQL (using XAMPP for local development)
- **Frontend**: React, Tailwind-CSS

## How It Works

### 1. User Registration:
New users sign up and set their product preferences during registration. These preferences are used to recommend products.

### 2. Similarity Metrics:
The system calculates similarity between products and user preferences using algorithms to generate personalized recommendations.

### 3. Product Search:
Users can search for specific products using a search bar that retrieves relevant items from the MySQL database.

### 4. Dashboard:
The main dashboard displays personalized recommendations based on user preferences or trending products.

### 5. Wishlist:
Users can add interesting products to their wishlist for future reference.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- **Python** (version 3.x)
- **Flask** (Python web framework)
- **MySQL** (Using XAMPP or another MySQL service for local development)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Th1l1na/Recommendation_system_E_commerce
    ```
2. Navigate to the project directory:
    ```bash
    cd Recommendation_system_E_commerce
    ```
3. Install the required dependencies for backend:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
4. Install the required dependencies for frontend:
    ```bash
    cd frontend
    npm install
    ```

### Database Setup

1. Set up MySQL database using XAMPP or any other MySQL service.
2. Create a new database and import the provided schema from the `schema.sql` file:
    ```bash
    mysql -u your-username -p your-database < schema.sql
    ```
3. Update the `config.py` file with your MySQL database credentials:
    ```python
    DATABASE = {
        'host': 'localhost',
        'user': 'your-username',
        'password': 'your-password',
        'db': 'your-database'
    }
    ```

### Running the Application

1. Run the Flask application:
    ```bash
    flask run
    ```
2. Access the system by visiting [http://localhost:3000](http://localhost:3000) in your browser.

## Future Enhancements

- **Improved Recommendation Algorithms**: Integration with more advanced algorithms such as collaborative filtering or content-based filtering.
- **Product Categorization**: Enhanced product categorization and filtering options for more refined searches.
- **UI Improvements**: An improved user interface featuring real-time product trends and analytics.

## Contributors

- [Thilina Samarasekara](https://github.com/Th1l1na)
- [Thulasika Nayanjalee](https://github.com/Nayananjalee)
- [Kanjana Jayasinghe]()
- [Thimalka Costa](https://github.com/thimax01)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
