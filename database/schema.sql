CREATE DATABASE IF NOT EXISTS gift_budgeter;
USE gift_budgeter;
-- =====================================================
-- USERS TABLE
-- One user has one permanent home currency
-- =====================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    home_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_email (email),
    INDEX idx_home_currency (home_currency),

    -- Constraints
    CONSTRAINT chk_home_currency_length
    CHECK (CHAR_LENGTH(home_currency) = 3)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- WISHLISTS TABLE
-- One user can have multiple wishlists
-- =====================================================
CREATE TABLE wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    wishlist_name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key
    CONSTRAINT fk_wishlist_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_wishlist_name (wishlist_name),
    INDEX idx_created_at (created_at)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- WISHLIST ITEMS TABLE
-- Stores items inside wishlists
-- =====================================================
CREATE TABLE wishlist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wishlist_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    foreign_price DECIMAL(10,2) NOT NULL,
    foreign_currency VARCHAR(3) NOT NULL,
    converted_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key
    CONSTRAINT fk_item_wishlist
    FOREIGN KEY (wishlist_id)
    REFERENCES wishlists(id)
    ON DELETE CASCADE,

    -- Indexes
    INDEX idx_wishlist_id (wishlist_id),
    INDEX idx_foreign_currency (foreign_currency),
    INDEX idx_created_at (created_at),

    -- Constraints
    CONSTRAINT chk_foreign_price_positive
    CHECK (foreign_price > 0),

    CONSTRAINT chk_converted_price_positive
    CHECK (
        converted_price IS NULL
        OR converted_price > 0
    ),

    CONSTRAINT chk_foreign_currency_length
    CHECK (CHAR_LENGTH(foreign_currency) = 3)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- EXCHANGE RATES TABLE
-- Stores currency conversion rates
-- =====================================================
CREATE TABLE exchange_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(10,6) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    -- Unique Constraint
    UNIQUE KEY unique_rate (
        from_currency,
        to_currency
    ),
    -- Indexes
    INDEX idx_currency_lookup (
        from_currency,
        to_currency
    ),
    INDEX idx_last_updated (last_updated),

    -- Constraints
    CONSTRAINT chk_rate_positive
    CHECK (rate > 0),
    CONSTRAINT chk_currency_length
    CHECK (
        CHAR_LENGTH(from_currency) = 3
        AND
        CHAR_LENGTH(to_currency) = 3
    )
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE EXCHANGE RATE DATA
-- =====================================================
INSERT INTO exchange_rates
(from_currency, to_currency, rate)
VALUES
('USD', 'EUR', 0.851900),
('USD', 'GBP', 0.736800),
('USD', 'JPY', 156.850000),
('USD', 'CHF', 0.779700),
('USD', 'CAD', 1.363700),
('USD', 'AUD', 1.383800),
('USD', 'CNY', 6.827700),
('USD', 'INR', 95.957500),
('USD', 'MXN', 17.120000),
('USD', 'BRL', 5.440000),
('USD', 'SGD', 1.347000),
('USD', 'HKD', 7.820000),
('USD', 'NOK', 10.720000),
('USD', 'SEK', 10.520000),
('USD', 'DKK', 6.870000),
('USD', 'RUB', 89.500000),
('USD', 'KRW', 1378.000000),
('USD', 'THB', 36.740000),
('USD', 'MYR', 4.690000),
('USD', 'PHP', 57.300000) 

ON DUPLICATE KEY UPDATE
rate = VALUES(rate);

-- =====================================================
-- STORED PROCEDURE
-- Get total wishlist budget in user's home currency
-- =====================================================
DELIMITER //

CREATE PROCEDURE get_wishlist_total(
    IN p_wishlist_id INT
)
BEGIN
    SELECT
        w.id AS wishlist_id,
        w.wishlist_name,
        u.name AS user_name,
        u.home_currency,
        COUNT(wi.id) AS total_items,
        COALESCE(
            SUM(wi.converted_price),
            0
        ) AS total_budget
    FROM wishlists w
    JOIN users u
        ON w.user_id = u.id
    LEFT JOIN wishlist_items wi
        ON w.id = wi.wishlist_id
    WHERE w.id = p_wishlist_id
    GROUP BY
        w.id,
        w.wishlist_name,
        u.name,
        u.home_currency;
END //

DELIMITER ;

-- =====================================================
-- VIEW FOR QUICK SUMMARY
-- =====================================================
CREATE VIEW v_wishlist_summary AS

SELECT
    w.id AS wishlist_id,
    w.wishlist_name,
    u.name AS user_name,
    u.home_currency,
    COUNT(wi.id) AS total_items,

    COALESCE(
        SUM(wi.converted_price),
        0
    ) AS total_budget,
    MIN(wi.created_at) AS first_item_added,
    MAX(wi.updated_at) AS latest_item_update
FROM wishlists w
JOIN users u
    ON w.user_id = u.id
LEFT JOIN wishlist_items wi
    ON w.id = wi.wishlist_id
GROUP BY
    w.id,
    w.wishlist_name,
    u.name,
    u.home_currency;