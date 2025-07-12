CREATE DATABASE odoo;
USE odoo;

-- USERS TABLE
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    points INT DEFAULT 0,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- ITEMS TABLE
CREATE TABLE Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    type VARCHAR(50),
    size VARCHAR(20),
    `condition` VARCHAR(50) NOT NULL,
    point_value INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending_approval' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);

-- ITEM IMAGES TABLE
CREATE TABLE ItemImages (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_thumbnail TINYINT(1) DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
);


-- CATEGORIES TABLE
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);

-- TAGS TABLE
CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(50) UNIQUE NOT NULL
);

-- ITEMTAGS JOIN TABLE
CREATE TABLE ItemTags (
    item_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (item_id, tag_id),
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

-- SWAP REQUESTS TABLE
CREATE TABLE SwapRequests (
    swap_request_id INT AUTO_INCREMENT PRIMARY KEY,
    requester_id INT NOT NULL,
    requested_item_id INT NOT NULL,
    offered_item_id INT,
    request_message TEXT,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES Users(user_id),
    FOREIGN KEY (requested_item_id) REFERENCES Items(item_id),
    FOREIGN KEY (offered_item_id) REFERENCES Items(item_id)
);

-- POINT TRANSACTIONS TABLE
CREATE TABLE PointTransactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT,
    points_amount INT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

-- ADMINS TABLE
CREATE TABLE Admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'moderator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_logs (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT,  
  action_type ENUM('approve_item', 'reject_item', 'ban_user', 'unban_user', 'reject_swap', 'approve_swap') NOT NULL,
  target_type ENUM('user', 'item', 'swap') NOT NULL,
  target_id INT NOT NULL,
  notes TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_admin_user FOREIGN KEY (admin_id)
    REFERENCES users(user_id)
    ON DELETE SET NULL
);

