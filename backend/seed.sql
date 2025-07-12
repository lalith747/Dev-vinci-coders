USE odoo;
-- USERS
INSERT INTO Users (username, email, password_hash, points, location)
VALUES 
('alice', 'alice@example.com', 'hashed_pw1', 120, 'Hyderabad'),
('bob', 'bob@example.com', 'hashed_pw2', 80, 'Mumbai'),
('carol', 'carol@example.com', 'hashed_pw3', 50, 'Bangalore'),
('dave', 'dave@example.com', 'hashed_pw4', 30, 'Chennai'),
('emma', 'emma@example.com', 'hashed_pw5', 150, 'Pune'),
('farah', 'farah@example.com', 'hashed_pw6', 90, 'Delhi');

-- ADMINS
INSERT INTO Admins (username, password_hash, email, role)
VALUES
('admin1', 'adminpw1', 'admin1@example.com', 'super_admin'),
('mod1', 'modpw1', 'mod1@example.com', 'moderator');

-- CATEGORIES
INSERT INTO Categories (category_name)
VALUES 
('Tops'), ('Bottoms'), ('Dresses'), ('Outerwear'), ('Footwear');

-- TAGS
INSERT INTO Tags (tag_name)
VALUES 
('Summer'), ('Casual'), ('Formal'), ('Vintage'), ('Denim'), 
('Winter'), ('Office'), ('Party'), ('Cotton'), ('Trendy');

-- ITEMS
INSERT INTO Items (owner_id, title, description, category, type, size, `condition`, point_value, status)
VALUES 
(1, 'Red Cotton Top', 'Light and comfy cotton top.', 'Tops', 'T-shirt', 'M', 'Excellent', 20, 'available'),
(2, 'Blue Jeans', 'Stretchable high-rise jeans.', 'Bottoms', 'Jeans', '30x32', 'Good', 25, 'available'),
(3, 'Floral Dress', 'Printed knee-length floral dress.', 'Dresses', 'Dress', 'S', 'New with tags', 40, 'available'),
(4, 'Black Blazer', 'Wool blend formal blazer.', 'Outerwear', 'Blazer', 'L', 'Excellent', 50, 'available'),
(5, 'White Sneakers', 'Trendy white sneakers.', 'Footwear', 'Sneakers', 'US 8', 'Good', 30, 'available'),
(6, 'Green Hoodie', 'Cozy hoodie for winter.', 'Outerwear', 'Hoodie', 'M', 'Worn', 15, 'available');

-- ITEM IMAGES
INSERT INTO ItemImages (item_id, image_url, is_thumbnail)
VALUES
(1, 'https://via.placeholder.com/150?text=Top', 1),
(2, 'https://via.placeholder.com/150?text=Jeans', 1),
(3, 'https://via.placeholder.com/150?text=Dress', 1),
(4, 'https://via.placeholder.com/150?text=Blazer', 1),
(5, 'https://via.placeholder.com/150?text=Sneakers', 1),
(6, 'https://via.placeholder.com/150?text=Hoodie', 1);

-- ITEM TAGS
INSERT INTO ItemTags (item_id, tag_id)
VALUES
(1, 1), (1, 2),     -- Top: Summer, Casual
(2, 5),             -- Jeans: Denim
(3, 1), (3, 3),     -- Dress: Summer, Formal
(4, 3), (4, 7),     -- Blazer: Formal, Office
(5, 2), (5, 10),    -- Sneakers: Casual, Trendy
(6, 2), (6, 6);     -- Hoodie: Casual, Winter

-- SWAP REQUESTS
INSERT INTO SwapRequests (requester_id, requested_item_id, offered_item_id, request_message, status)
VALUES
(2, 1, 2, 'Would you like to swap your top for my jeans?', 'pending'),
(3, 2, NULL, 'I don’t have a swap, but I’m willing to buy with points.', 'pending'),
(4, 3, 4, 'Interested in the dress for my blazer?', 'pending'),
(5, 5, 6, 'Sneakers for hoodie?', 'accepted');

-- POINT TRANSACTIONS
INSERT INTO PointTransactions (user_id, item_id, points_amount, transaction_type, description)
VALUES
(1, 1, 10, 'item_listed', 'Listed item: Red Cotton Top'),
(2, 2, 10, 'item_listed', 'Listed item: Blue Jeans'),
(3, 3, 10, 'item_listed', 'Listed item: Floral Dress'),
(4, 4, 10, 'item_listed', 'Listed item: Black Blazer'),
(5, 5, 10, 'item_listed', 'Listed item: White Sneakers'),
(6, 6, 10, 'item_listed', 'Listed item: Green Hoodie'),
(2, NULL, -25, 'swap_out_complete', 'Swapped item with Alice'),
(1, NULL, 25, 'swap_in_complete', 'Received swap item from Bob'),
(5, 5, -30, 'item_redeemed', 'Used points to get sneakers');

-- ADMIN LOGS
INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, notes)
VALUES 
(1, 'approve_item', 'item', 1, 'Looks good, item approved.'),
(2, 'reject_swap', 'swap', 2, 'Swap request invalid without item offer.'),
(1, 'approve_item', 'item', 4, 'Professional blazer, approved.'),
(2, 'approve_swap', 'swap', 4, 'Swap looks valid and accepted.');

