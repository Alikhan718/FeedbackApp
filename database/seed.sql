-- Users
INSERT INTO users (email, password_hash, role) VALUES
('owner1@biz.com', 'hashedpassword1', 'business_owner'),
('client1@email.com', 'hashedpassword2', 'client');

-- Businesses
INSERT INTO businesses (name, industry, location, owner_id) VALUES
('Pizza Palace', 'Restaurant', '123 Main St', 1);

-- Bonuses
INSERT INTO bonuses (business_id, description, type, value, conditions, is_active, created_at) VALUES
(1, '10% off next visit', 'discount', 10, 'Valid for orders over $20', true, NOW()),
(1, 'Free dessert', 'gift', NULL, 'One per customer', true, NOW()),
(1, '5% off for friends', 'discount', 5, 'Bring a friend', false, NOW());

-- Reviews
INSERT INTO reviews (user_id, business_id, text, rating, receipt_image_url, ai_sentiment, ai_topics, created_at) VALUES
(2, 1, 'Great pizza and service!', 5, 'https://dummyurl.com/receipt1.jpg', 'positive', 'food,service', NOW()),
(2, 1, 'Nice atmosphere, but slow service.', 3, 'https://dummyurl.com/receipt2.jpg', 'neutral', 'atmosphere,service', NOW());

-- UserBonuses
INSERT INTO user_bonuses (user_id, bonus_id, status, created_at) VALUES
(2, 1, 'claimed', NOW()),
(2, 2, 'redeemed', NOW());

-- Settings
INSERT INTO settings (business_id, reward_trigger_rules, notification_email) VALUES
(1, 'min_order:20', 'owner1@biz.com'); 