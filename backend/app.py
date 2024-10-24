from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error
import bcrypt
import datetime
from datetime import datetime
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from fuzzywuzzy import process
from datetime import datetime 
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd 
from surprise import Reader, Dataset
from sklearn.model_selection import train_test_split
from surprise import KNNBasic
from sklearn.metrics.pairwise import linear_kernel
from sklearn.decomposition import TruncatedSVD
from sklearn.neighbors import NearestNeighbors




app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


# MySQL database configuration
MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = 'Batman@12345'
MYSQL_DB = 'recommend'

# Connect to the MySQL database
def db_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB
    )

# API to get all categories from products table
@app.route('/categories', methods=['GET'])
def get_categories():
    conn = db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT DISTINCT categoryName FROM products")
        categories = [row[0].split()[0] for row in cursor.fetchall()]
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    preferences = data.get('preferences', '')  # Optional preferences

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    conn = db_connection()
    cursor = conn.cursor()
    try:
        # Insert user into the users table
        cursor.execute("INSERT INTO users (preferences) VALUES (%s)", (preferences,))
        conn.commit()
        
        # Get the last inserted user_id
        last_user_id = cursor.lastrowid
        
        # Insert into the login table
        cursor.execute("INSERT INTO login (user_id, username, password) VALUES (%s, %s, %s)",
                       (last_user_id, username, hashed_password))
        conn.commit()
        
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    conn = db_connection()
    cursor = conn.cursor()

    try:
        # Get user details from the login table
        cursor.execute("SELECT user_id, password FROM login WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user:
            user_id, stored_password = user
            # Check the password
            if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                return jsonify({"message": "Login successful!", "user_id": user_id}), 200
            else:
                return jsonify({"error": "Invalid password!"}), 401
        else:
            return jsonify({"error": "User not found!"}), 404
    except Exception as e:
        print(e)  # Log the error for debugging
        return jsonify({"error": "An error occurred during login!"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        # Establish a database connection
        conn = db_connection()
        cursor = conn.cursor()

        # Query to fetch user profile
        query = "SELECT user_id, preferences FROM users WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        # Close cursor and connection
        cursor.close()
        conn.close()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Return user data
        return jsonify({
            'user_id': user[0],
            'preferences': user[1],
        })
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
# API to update user profile
@app.route('/profile', methods=['PUT'])
def update_profile():
    data = request.get_json()
    user_id = data.get('user_id')
    username = data.get('username')
    password = data.get('password')
    preferences = data.get('preferences')

    conn = db_connection()
    cursor = conn.cursor()

    try:
        # If password is provided, hash it
        if password:
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute("UPDATE login SET username = %s, password = %s WHERE user_id = %s",
                           (username, hashed_password, user_id))
        else:
            cursor.execute("UPDATE login SET username = %s WHERE user_id = %s", (username, user_id))

        # Update user preferences
        cursor.execute("UPDATE users SET preferences = %s WHERE user_id = %s", (preferences, user_id))
        
        conn.commit()

        return jsonify({"message": "Profile updated successfully!"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()


#get user  whishlist item
@app.route('/wishlist', methods=['GET'])
def get_wishlist_items():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    connection = db_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        # Get the wishlist items for the user from the users table
        cursor.execute("SELECT wishlist_items FROM users WHERE user_id = %s", (user_id,))
        result = cursor.fetchone()
        
        if result and result['wishlist_items']:
            # Assume wishlist_items are stored as a comma-separated string of product ASINs
            wishlist_asins = result['wishlist_items'].split(',')

            # Fetch product details based on ASINs from the products table
            format_strings = ','.join(['%s'] * len(wishlist_asins))
            cursor.execute(f"SELECT asin, title, price, stars, reviews, imgUrl, productURL FROM products WHERE asin IN ({format_strings})", tuple(wishlist_asins))
            products = cursor.fetchall()

            return jsonify({"wishlist_items": products})
        
        return jsonify({"wishlist_items": []})

    except Error as e:
        print(f"Error fetching wishlist items: {e}")
        return jsonify({"error": "Error fetching wishlist items"}), 500

    finally:
        cursor.close()
        connection.close()



# Track user's viewed items
@app.route('/add_viewed_item/<int:user_id>', methods=['POST'])
def add_viewed_item(user_id):
    data = request.get_json()
    asin = data['asin']

    conn = db_connection()
    cursor = conn.cursor()

    try:
        # Get current viewed items
        cursor.execute("SELECT viewed_items FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        if user:
            viewed_items = user[0].split(',') if user[0] else []
            viewed_items.append(asin)
            # Update viewed items for the user
            cursor.execute("UPDATE users SET viewed_items = %s WHERE user_id = %s", (','.join(viewed_items), user_id))
            conn.commit()
            return jsonify({"message": "Viewed item added!"}), 200
        else:
            return jsonify({"error": "User not found!"}), 404
    finally:
        cursor.close()
        conn.close()

# Fetch all categories and top 3 products per category
@app.route('/products', methods=['GET'])
def get_products():
    conn = db_connection()
    cursor = conn.cursor()

    try:
        # Fetch all unique categories
        cursor.execute("SELECT DISTINCT categoryName FROM products")
        categories = [row[0] for row in cursor.fetchall()]

        # Fetch top 3 products per category
        products_by_category = {}
        for category in categories:
            cursor.execute("""
                SELECT asin, title, price, stars, reviews, imgUrl 
                FROM products 
                WHERE categoryName = %s 
                ORDER BY reviews DESC 
                LIMIT 3
            """, (category,))
            products = cursor.fetchall()
            products_by_category[category] = [{
                "asin": product[0],
                "title": product[1],
                "price": product[2],
                "stars": product[3],
                "reviews": product[4],
                "imgUrl": product[5]
            } for product in products]

        return jsonify(products_by_category), 200
    finally:
        cursor.close()
        conn.close()


#add product to view item        
@app.route('/visit/<int:user_id>', methods=['POST'])
def visit_product(user_id):
    data = request.get_json()
    asin = data['asin']

    conn = db_connection()
    cursor = conn.cursor()

    try:
        # Get current viewed items
        cursor.execute("SELECT viewed_items FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        if user:
            viewed_items = user[0].split(',') if user[0] else []
            if asin not in viewed_items:
                viewed_items.append(asin)
                cursor.execute("UPDATE users SET viewed_items = %s WHERE user_id = %s", (','.join(viewed_items), user_id))
                conn.commit()

        # Fetch product URL
        cursor.execute("SELECT productURL FROM products WHERE asin = %s", (asin,))
        product = cursor.fetchone()
        if product:
            return jsonify({"url": product[0]}), 200
        else:
            return jsonify({"error": "Product not found!"}), 404
    finally:
        cursor.close()
        conn.close()
        
# Add product to wishlist
@app.route('/wishlist/<int:user_id>', methods=['POST'])
def add_to_wishlist(user_id):
    data = request.get_json()
    asin = data['asin']

    conn = db_connection()
    cursor = conn.cursor()

    try:
        # Get current wishlist items
        cursor.execute("SELECT wishlist_items FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        if user:
            wishlist = user[0].split(',') if user[0] else []
            if asin not in wishlist:
                wishlist.append(asin)
                cursor.execute("UPDATE users SET wishlist_items = %s WHERE user_id = %s", (','.join(wishlist), user_id))
                conn.commit()
                return jsonify({"message": "Added to wishlist!"}), 200
            else:
                return jsonify({"message": "Already in wishlist!"}), 200
        else:
            return jsonify({"error": "User not found!"}), 404
    finally:
        cursor.close()
        conn.close()

@app.route('/api/products/category/<string:category_name>', methods=['GET'])
def get_products_by_category(category_name):
    conn = mysql.connector.connect(host='localhost', user='root', password='1234', database='recommend')
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM products WHERE categoryName = %s", (category_name,))
    products = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(products)


@app.route('/recommendations', methods=['GET'])
def recommendations():
    user_id = request.args.get('user_id')

    # Connect to the database
    conn = db_connection()
    cursor = conn.cursor(dictionary=True)

    # Get user preferences and viewed/wishlist items
    cursor.execute("SELECT preferences, viewed_items, wishlist_items FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    preferences = user['preferences'].split(',') if user['preferences'] else []
    viewed_items = user['viewed_items'].split(',') if user['viewed_items'] else []
    wishlist_items = user['wishlist_items'].split(',') if user['wishlist_items'] else []

    # Fetch all products
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()

    # Calculate the mean rating (C) across all products
    total_rating = sum(product['stars'] * product['reviews'] for product in products if product['reviews'] > 0)
    total_reviews = sum(product['reviews'] for product in products if product['reviews'] > 0)
    C = total_rating / total_reviews if total_reviews > 0 else 0

    # Minimum number of reviews required to be considered
    m = 20

    # Dictionary to store recommendations with weighted scores
    recommendations = []

    # Collaborative Filtering: Build User-Item Matrix
    cursor.execute("SELECT user_id, viewed_items, wishlist_items FROM users")
    all_users = cursor.fetchall()

    product_asins = [product['asin'] for product in products]

    # Initialize user-item interaction matrix
    user_item_matrix = pd.DataFrame(0, index=[user['user_id'] for user in all_users], columns=product_asins)

    # Populate the user-item matrix with viewed/wishlist interactions
    for current_user in all_users:
        viewed_items = current_user['viewed_items'].split(',') if current_user['viewed_items'] else []
        wishlist_items = current_user['wishlist_items'].split(',') if current_user['wishlist_items'] else []
        interacted_items = set(viewed_items + wishlist_items)
        for asin in interacted_items:
            if asin in user_item_matrix.columns:
                user_item_matrix.loc[current_user['user_id'], asin] = 1

    # Apply Collaborative Filtering 
    svd = TruncatedSVD(n_components=20)
    user_factors = svd.fit_transform(user_item_matrix)

    # Get the current user's interaction vector
    current_user_vector = user_factors[user_item_matrix.index.get_loc(int(user_id))]

    # Find similar users using NearestNeighbors
    knn = NearestNeighbors(n_neighbors=10, metric='cosine')
    knn.fit(user_factors)
    distances, indices = knn.kneighbors([current_user_vector])

    # Get products viewed by similar users
    similar_users = user_item_matrix.index[indices.flatten()].tolist()
    similar_items = user_item_matrix.loc[similar_users].sum(axis=0)

    # Content-Based Filtering
    def content_based_filtering(user_preferences, product_titles):
        vectorizer = TfidfVectorizer(stop_words='english')
        product_title_vectors = vectorizer.fit_transform(product_titles)
        user_preference_vectors = vectorizer.transform(user_preferences)
        similarities = cosine_similarity(user_preference_vectors, product_title_vectors).flatten()
        return similarities

    product_titles = [product['title'] for product in products]
    user_preferences = [' '.join(pref.strip().lower() for pref in preferences)]
    content_based_scores = content_based_filtering(user_preferences, product_titles)

    # Filter and rank products based on various factors
    for i, product in enumerate(products):
        # Check for matches in preferences, viewed/wishlist items, and similar users
        
        matches_viewed = product['asin'] in viewed_items
        matches_wishlist = product['asin'] in wishlist_items
        matches_similar_viewed = product['asin'] in similar_items.index and similar_items[product['asin']] > 0

        # Adjust the score based on the importance of user preferences
        score = 0
        if content_based_scores[i]:
            score += 10  # Increase weight for content-based scores
        if matches_viewed:
            score += 2
        if matches_wishlist:
            score += 2
        if matches_similar_viewed:
            score += 7
         

        #hybrid filtering

        # Calculate Bayesian Average (Weighted Rating)
        R = product['stars']
        v = product['reviews']
        WR = (v / (v + m)) * R + (m / (v + m)) * C

        # Add the product to recommendations if it has a positive score
        if score > 0:
            recommendations.append({
                "asin": product['asin'],
                "title": product['title'],
                "price": product['price'],
                "stars": product['stars'],
                "reviews": product['reviews'],
                "imgUrl": product['imgUrl'],
                "score": score,
                "WR": WR
            })

    # Sort recommendations by score and weighted rating
    recommendations.sort(key=lambda x: (-x['score'], -x['WR']))

    # Evaluation metrics calculation
    relevant_items = set(wishlist_items)  # Example: consider wishlist as the ground truth
    recommended_items = set(item['asin'] for item in recommendations[:30])

    true_positive = len(relevant_items.intersection(recommended_items))
    false_positive = len(recommended_items - relevant_items)
    false_negative = len(relevant_items - recommended_items)

    # Calculate precision, recall, and F1 score
    precision = true_positive / (true_positive + false_positive) if (true_positive + false_positive) > 0 else 0
    recall = true_positive / (true_positive + false_negative) if (true_positive + false_negative) > 0 else 0
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

    # Print evaluation metrics to the terminal
    print(f"True Positives: {true_positive}")
    print(f"False Positives: {false_positive}")
    print(f"False Negatives: {false_negative}")
    print(f"Precision: {precision:.2f}")
    print(f"Recall: {recall:.2f}")
    print(f"F1 Score: {f1_score:.2f}")

    return jsonify(recommendations[:50]), 200


#start of trending

def collaborative_filtering(user_id, cursor):
    """
    Collaborative filtering based on viewed and wishlist items.
    """
    # Fetch viewed and wishlist items for all users except the current one
    cursor.execute("SELECT user_id, viewed_items, wishlist_items FROM users WHERE user_id != %s", (user_id,))
    other_users = cursor.fetchall()

    # Get current user's viewed and wishlist items
    cursor.execute("SELECT viewed_items, wishlist_items FROM users WHERE user_id = %s", (user_id,))
    current_user = cursor.fetchone()

    current_viewed_items = current_user['viewed_items'].split(',') if current_user['viewed_items'] else []
    current_wishlist_items = current_user['wishlist_items'].split(',') if current_user['wishlist_items'] else []

    # To store similarity scores and recommendations
    similarity_scores = {}
    recommended_items = {}

    # Calculate similarity based on viewed and wishlist items
    for other_user in other_users:
        other_viewed_items = other_user['viewed_items'].split(',') if other_user['viewed_items'] else []
        other_wishlist_items = other_user['wishlist_items'].split(',') if other_user['wishlist_items'] else []

        # Calculate Jaccard similarity for both viewed and wishlist items
        viewed_intersection = set(current_viewed_items) & set(other_viewed_items)
        viewed_union = set(current_viewed_items) | set(other_viewed_items)

        wishlist_intersection = set(current_wishlist_items) & set(other_wishlist_items)
        wishlist_union = set(current_wishlist_items) | set(other_wishlist_items)

        viewed_similarity = len(viewed_intersection) / len(viewed_union) if viewed_union else 0
        wishlist_similarity = len(wishlist_intersection) / len(wishlist_union) if wishlist_union else 0

        # Combine similarity scores (weights can be adjusted)
        total_similarity = viewed_similarity * 0.6 + wishlist_similarity * 0.4

        # Store the similarity score
        similarity_scores[other_user['user_id']] = total_similarity

        # Add items from other users' viewed/wishlist that are not in the current user's lists
        for item in other_viewed_items + other_wishlist_items:
            if item not in current_viewed_items and item not in current_wishlist_items:
                recommended_items[item] = recommended_items.get(item, 0) + total_similarity

    # Sort recommendations based on similarity score
    sorted_recommendations = sorted(recommended_items.items(), key=lambda x: -x[1])

    # Return top 10 recommended items
    return [item[0] for item in sorted_recommendations[:20]]

def merge_recommendations(scored_items, collaborative_items):
    """
    Merge collaborative filtering recommendations into the scored items.
    """
    for item in scored_items:
        if item['asin'] in collaborative_items:
            item['score'] += 2  # Boost score for collaborative filtering matches
    scored_items.sort(key=lambda x: -x['score'])  # Sort again after merging
    return scored_items

# Function to filter items by seasonal keywords using content-based filtering
def seasonal_content_based_filtering(trending_items, season_keywords):
    seasonal_trending = [
        item for item in trending_items
        if any(keyword.lower() in item['title'].lower() for keyword in season_keywords)
    ]
    return seasonal_trending

@app.route('/trending', methods=['GET'])
def trending():
    user_id = request.args.get('user_id')  # Capture the user_id if provided
    
    current_month = datetime.now().month
    season_keywords = []

    # Determine season based on current month
    if current_month in [12, 1, 2]:  # Winter
        season_keywords = ['winter', 'snow', 'cold', 'christmas', 'new year']
    elif current_month in [3, 4, 5]:  # Spring
        season_keywords = ['spring', 'blossom', 'flower', 'easter']
    elif current_month in [6, 7, 8]:  # Summer
        season_keywords = ['summer', 'beach', 'hot', 'sun', 'vacation', 'sunglass', 'swim']
    elif current_month in [9, 10, 11]:  # Fall/Autumn
        season_keywords = ['fall', 'autumn', 'leaves', 'halloween', 'thanksgiving', 'pumpkin']

    conn = db_connection()
    cursor = conn.cursor(dictionary=True)

    # Get user preferences and previously viewed/wishlist items if user_id is provided
    preferences = []
    viewed_items = []
    wishlist_items = []

    if user_id:
        cursor.execute("SELECT preferences, viewed_items, wishlist_items FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        if user:
            preferences = user['preferences'].split(',') if user['preferences'] else []
            viewed_items = user['viewed_items'].split(',') if user['viewed_items'] else []
            wishlist_items = user['wishlist_items'].split(',') if user['wishlist_items'] else []

    try:
        # Query for trending items based on recent sales
        cursor.execute("""
            SELECT asin, title, categoryName, price, stars, reviews, imgUrl, isBestSeller, boughtInLastMonth
            FROM products
            WHERE boughtInLastMonth > 0
            ORDER BY boughtInLastMonth DESC, reviews DESC, stars DESC, isBestSeller DESC
        """)
        trending_items = cursor.fetchall()

        # Seasonal content-based filtering
        seasonal_trending = seasonal_content_based_filtering(trending_items, season_keywords)


        # Fallback to top trending if no seasonal items found
        if not seasonal_trending:
            seasonal_trending = trending_items

        # Incorporate user preferences, viewed, and wishlist items into the trending list
        scored_trending_items = []
        for item in seasonal_trending:
            score = 0
            # Check for user preferences
            if preferences and any(pref.strip().lower() in item['title'].lower() for pref in preferences):
                score += 5  # Higher score for preference match

            # Check for matches in viewed and wishlist items
            if item['asin'] in viewed_items:
                score += 3  # Boost for previously viewed items
            if item['asin'] in wishlist_items:
                score += 4  # Higher boost for wishlist items

            # Boost score based on stars, reviews, and sales
            score += item['stars'] * 2  # Weight stars more
            score += item['reviews'] * 0.1  # Slight boost for reviews
            score += item['boughtInLastMonth']  # Directly add monthly sales

            if item['isBestSeller'] == 'Yes':
                score += 5  # Boost for best sellers

            # Append the item with the calculated score
            item['score'] = score
            scored_trending_items.append(item)

        # Sort by calculated score
        scored_trending_items.sort(key=lambda x: -x['score'])

        # Hybrid approach: Collaborative Filtering
        if user_id:
            collaborative_items = collaborative_filtering(user_id, cursor)
            scored_trending_items = merge_recommendations(scored_trending_items, collaborative_items)

        # Format the trending items for response
        trending_items_list = [{
            "asin": item['asin'],
            "title": item['title'],
            "category": item['categoryName'],
            "price": item['price'],
            "stars": item['stars'],
            "reviews": item['reviews'],
            "imgUrl": item['imgUrl'],
            "isBestSeller": item['isBestSeller'],
            "boughtInLastMonth": item['boughtInLastMonth']
        } for item in scored_trending_items]

        return jsonify({"trending_items": trending_items_list[:100]}), 200
    finally:
        cursor.close()
        conn.close()




#start of searchking



# User-Item Matrix for Collaborative Filtering
def get_user_item_matrix(cursor):
    # Fetch users and products
    cursor.execute("SELECT user_id, viewed_items, wishlist_items FROM users")
    user_data = cursor.fetchall()
    
    cursor.execute("SELECT asin FROM products")
    products = [row['asin'] for row in cursor.fetchall()]

    # Initialize the user-item matrix
    user_item_matrix = pd.DataFrame(0, index=[row['user_id'] for row in user_data], columns=products)

    # Populate the user-item matrix
    for row in user_data:
        viewed_items = row['viewed_items'].split(',') if row['viewed_items'] else []
        wishlist_items = row['wishlist_items'].split(',') if row['wishlist_items'] else []
        all_items = set(viewed_items + wishlist_items)
        
        for item in all_items:
            if item in user_item_matrix.columns:
                user_item_matrix.at[row['user_id'], item] = 1
    
    return user_item_matrix

# Collaborative Filtering Function
def get_collaborative_recommendations(user_id, user_item_matrix, n=5):
    # Get user similarity using cosine similarity
    user_sim_matrix = cosine_similarity(user_item_matrix)
    
    # Get the index of the target user
    target_user_idx = user_item_matrix.index.get_loc(user_id)

    # Find the top N similar users
    knn = NearestNeighbors(n_neighbors=n+1, metric='cosine')  # +1 to exclude self
    knn.fit(user_sim_matrix)
    distances, indices = knn.kneighbors(user_sim_matrix[target_user_idx].reshape(1, -1), n_neighbors=n+1)

    # Get the most similar users (exclude the first one, which is the target user)
    similar_users_idx = indices.flatten()[1:]

    # Aggregate products viewed/wishlist by similar users
    similar_users = user_item_matrix.iloc[similar_users_idx]
    product_scores = similar_users.sum(axis=0)
    
    # Exclude products the target user has already interacted with
    user_interacted_products = set(user_item_matrix.loc[user_id][user_item_matrix.loc[user_id] == 1].index)
    recommended_products = product_scores.drop(labels=user_interacted_products).sort_values(ascending=False)

    return recommended_products.index[:n].tolist()

# Content-Based Filtering Function
def get_content_based_recommendations(query, products, n=20):
    # Use TF-IDF to vectorize product titles and categories
    tfidf = TfidfVectorizer(stop_words='english')

    # Combine titles and category for better similarity matching
    products['combined_info'] = products['title'] + ' ' + products['categoryName']
    
    # Vectorize combined info
    tfidf_matrix = tfidf.fit_transform(products['combined_info'])

    # Vectorize the user query
    query_tfidf = tfidf.transform([query])

    # Calculate cosine similarity between the query and all products
    cosine_sim = cosine_similarity(query_tfidf, tfidf_matrix)

    # Get similarity scores and sort them
    sim_scores = list(enumerate(cosine_sim[0]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get the indices of the most similar products
    product_indices = [i[0] for i in sim_scores[:n]]

    # Return the top N similar products
    return products.iloc[product_indices]['asin'].tolist()

# Search Function
@app.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('query', '')
    user_id = request.args.get('user_id')  # Assuming user_id is provided to factor in user history
    n = 20  # Number of recommendations to return

    conn = db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        preferences, viewed_items, wishlist_items = [], [], []

        if user_id:
            cursor.execute("SELECT preferences, viewed_items, wishlist_items FROM users WHERE user_id = %s", (user_id,))
            user = cursor.fetchone()
            if user:
                preferences = user['preferences'].split(',') if user['preferences'] else []
                viewed_items = user['viewed_items'].split(',') if user['viewed_items'] else []
                wishlist_items = user['wishlist_items'].split(',') if user['wishlist_items'] else []

        if not query:
            # If no query is provided, return the top products
            cursor.execute("SELECT asin, title, categoryName, price, stars, reviews, imgUrl, isBestSeller FROM products ORDER BY stars DESC, reviews DESC, isBestSeller DESC")
            results = cursor.fetchall()
        else:
            # Search for products based on the query
            cursor.execute("SELECT asin, title, categoryName, price, stars, reviews, imgUrl, isBestSeller FROM products")
            results = cursor.fetchall()

            # Create a DataFrame from results for content-based recommendations
            products_df = pd.DataFrame(results)

            # Apply content-based filtering to get products similar to the query
            content_recommendations = get_content_based_recommendations(query, products_df, n)

            # Filter results based on content recommendations
            content_results = [product for product in results if product['asin'] in content_recommendations]

        # Get the user-item matrix for collaborative filtering
        user_item_matrix = get_user_item_matrix(cursor)

        # Apply collaborative filtering for recommendations
        if user_id:
            collaborative_recommendations = get_collaborative_recommendations(user_id, user_item_matrix, n)

            # Merge collaborative and content-based recommendations
            combined_recommendations = list(set(content_recommendations + collaborative_recommendations))

            # Filter results based on combined recommendations
            final_results = [product for product in results if product['asin'] in combined_recommendations]
        else:
            final_results = content_results  # If no user_id, fall back to content-based only

        # Rank the results based on user preferences and interaction history
        for product in final_results:
            product_score = 0
            if preferences and any(pref.strip().lower() in product['title'].lower() for pref in preferences):
                product_score += 5
            if viewed_items and product['asin'] in viewed_items:
                product_score += 3
            if wishlist_items and product['asin'] in wishlist_items:
                product_score += 4
            product['score'] = product_score

        # Sort by score, then stars, then reviews
        sorted_results = sorted(final_results, key=lambda x: (-x['score'], -x['stars'], -x['reviews']))

        search_results = [{
            "asin": product['asin'],
            "title": product['title'],
            "price": product['price'],
            "stars": product['stars'],
            "reviews": product['reviews'],
            "imgUrl": product['imgUrl'],
            "isBestSeller": product['isBestSeller']
        } for product in sorted_results]

        return jsonify({"search_results": search_results}), 200
    finally:
        cursor.close()
        conn.close()



@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(debug=True)
