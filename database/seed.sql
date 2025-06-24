-- Users
INSERT INTO users (email, password_hash, role) VALUES
('owner1@biz.com', 'hashedpassword1', 'business_owner'),
('client1@email.com', 'hashedpassword2', 'client');

-- Businesses
INSERT INTO businesses (name, industry, location, owner_id) VALUES
('Wyndham Residences Aqkol', 'Restaurant', 'Aqkol, Kazakhstan', 1);

-- Bonuses
INSERT INTO bonuses (business_id, description, type, value, conditions, is_active, created_at) VALUES
(1, '10% off next visit', 'discount', 10, 'Valid for orders over $20', true, NOW()),
(1, 'Free dessert', 'gift', NULL, 'One per customer', true, NOW()),
(1, '5% off for friends', 'discount', 5, 'Bring a friend', false, NOW());

-- Reviews
INSERT INTO reviews (user_id, business_id, text, rating, receipt_image_url, ai_sentiment, ai_topics, created_at) VALUES
(2, 1, 'Great hotel and service! I would definitely recommend it to my friends. The staff is friendly and the rooms are clean. The location is also great, really close to the nature. The only downside is that the breakfast is not included in the price and it is a bit expensive. But overall, I would definitely recommend it to my friends.', 5, 'https://dummyurl.com/receipt1.jpg', 'positive', 'food,service', NOW()),
(2, 1, 'Nice atmosphere. The food was prepared well, but the service was slow. The location is great, really close to the nature. The only downside is that the breakfast is not included in the price and it is a bit expensive. But overall, I would recommend it to my friends.', 3, 'https://dummyurl.com/receipt2.jpg', 'neutral', 'atmosphere,service', NOW());

-- UserBonuses
INSERT INTO user_bonuses (user_id, bonus_id, status, created_at) VALUES
(2, 1, 'claimed', NOW()),
(2, 2, 'redeemed', NOW());

-- Settings
INSERT INTO settings (business_id, reward_trigger_rules, notification_email) VALUES
(1, 'min_order:20', 'owner1@biz.com'); 