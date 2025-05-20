-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL, -- 'client' or 'business'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- companies table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    location VARCHAR(255),
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    companies_id INTEGER REFERENCES companies(id),
    text TEXT,
    rating INTEGER,
    receipt_image_url VARCHAR(500),
    ai_sentiment VARCHAR(20),
    ai_topics TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bonuses table
CREATE TABLE bonuses (
    id SERIAL PRIMARY KEY,
    companies_id INTEGER REFERENCES companies(id),
    description TEXT,
    type VARCHAR(50),
    value NUMERIC(10,2),
    conditions TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- UserBonuses table
CREATE TABLE user_bonuses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    bonus_id INTEGER REFERENCES bonuses(id),
    status VARCHAR(20), -- 'claimed' or 'redeemed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    companies_id INTEGER REFERENCES companies(id),
    reward_trigger_rules TEXT,
    notification_email VARCHAR(255)
);
