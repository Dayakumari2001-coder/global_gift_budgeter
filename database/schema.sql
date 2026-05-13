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
('EUR', 'USD', 1.10),
('GBP', 'USD', 1.27),
('JPY', 'USD', 0.0067),
('CHF', 'USD', 1.12),
('CAD', 'USD', 0.74),
('AUD', 'USD', 0.65),
('CNY', 'USD', 0.14),
('INR', 'USD', 0.012),
('MXN', 'USD', 0.058),
('BRL', 'USD', 0.20),
('SGD', 'USD', 0.74),
('HKD', 'USD', 0.128),
('NOK', 'USD', 0.095),
('SEK', 'USD', 0.094),
('DKK', 'USD', 0.148),
('RUB', 'USD', 0.011),
('KRW', 'USD', 0.00077),
('THB', 'USD', 0.028),
('MYR', 'USD', 0.21),
('PHP', 'USD', 0.018)

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