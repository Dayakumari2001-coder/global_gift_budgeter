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
('USD', 'USD', 1.0000),
('USD', 'AED', 3.6725),
('USD', 'AFN', 63.7467),
('USD', 'ALL', 81.9623),
('USD', 'AMD', 368.0882),
('USD', 'ANG', 1.7900),
('USD', 'AOA', 927.0523),
('USD', 'ARS', 1394.9740),
('USD', 'AUD', 1.3956),
('USD', 'AWG', 1.7900),
('USD', 'AZN', 1.6989),
('USD', 'BAM', 1.6789),
('USD', 'BBD', 2.0000),
('USD', 'BDT', 122.8595),
('USD', 'BGN', 1.6789),
('USD', 'BHD', 0.3760),
('USD', 'BIF', 2983.8933),
('USD', 'BMD', 1.0000),
('USD', 'BND', 1.2788),
('USD', 'BOB', 6.9286),
('USD', 'BRL', 5.0433),
('USD', 'BSD', 1.0000),
('USD', 'BTN', 96.3853),
('USD', 'BWP', 13.8126),
('USD', 'BYN', 2.7542),
('USD', 'BZD', 2.0000),
('USD', 'CAD', 1.3738),
('USD', 'CDF', 2250.6947),
('USD', 'CHF', 0.7848),
('USD', 'CLF', 0.02299),
('USD', 'CLP', 908.6913),
('USD', 'CNH', 6.7996),
('USD', 'CNY', 6.8131),
('USD', 'COP', 3791.1870),
('USD', 'CRC', 454.9338),
('USD', 'CUP', 24.0000),
('USD', 'CVE', 94.6524),
('USD', 'CZK', 20.8668),
('USD', 'DJF', 177.7210),
('USD', 'DKK', 6.4067),
('USD', 'DOP', 59.5351),
('USD', 'DZD', 132.4654),
('USD', 'EGP', 53.3217),
('USD', 'ERN', 15.0000),
('USD', 'ETB', 156.0390),
('USD', 'EUR', 0.8584),
('USD', 'FJD', 2.1937),
('USD', 'FKP', 0.7456),
('USD', 'FOK', 6.4067),
('USD', 'GBP', 0.7456),
('USD', 'GEL', 2.6748),
('USD', 'GGP', 0.7456),
('USD', 'GHS', 11.4431),
('USD', 'GIP', 0.7456),
('USD', 'GMD', 74.1816),
('USD', 'GNF', 8767.5265),
('USD', 'GTQ', 7.6208),
('USD', 'GYD', 209.1305),
('USD', 'HKD', 7.8306),
('USD', 'HNL', 26.5796),
('USD', 'HRK', 6.4677),
('USD', 'HTG', 130.8384),
('USD', 'HUF', 309.4347),
('USD', 'IDR', 17666.7702),
('USD', 'ILS', 2.9038),
('USD', 'IMP', 0.7456),
('USD', 'INR', 96.3760),
('USD', 'IQD', 1311.0090),
('USD', 'IRR', 1219378.5376),
('USD', 'ISK', 123.0732),
('USD', 'JEP', 0.7456),
('USD', 'JMD', 157.8182),
('USD', 'JOD', 0.7090),
('USD', 'JPY', 158.8085),
('USD', 'KES', 129.2545),
('USD', 'KGS', 87.4960),
('USD', 'KHR', 4035.6328),
('USD', 'KID', 1.3955),
('USD', 'KMF', 422.3091),
('USD', 'KRW', 1494.4185),
('USD', 'KWD', 0.3083),
('USD', 'KYD', 0.8333),
('USD', 'KZT', 468.0836),
('USD', 'LAK', 21811.5379),
('USD', 'LBP', 89500.0000),
('USD', 'LKR', 326.0890),
('USD', 'LRD', 182.9753),
('USD', 'LSL', 16.5943),
('USD', 'LYD', 6.3480),
('USD', 'MAD', 9.2082),
('USD', 'MDL', 17.2295),
('USD', 'MGA', 4199.7073),
('USD', 'MKD', 52.9304),
('USD', 'MMK', 2098.1894),
('USD', 'MNT', 3554.8563),
('USD', 'MOP', 8.0657),
('USD', 'MRU', 40.0597),
('USD', 'MUR', 47.2211),
('USD', 'MVR', 15.4357),
('USD', 'MWK', 1743.1566),
('USD', 'MXN', 17.2791),
('USD', 'MYR', 3.9732),
('USD', 'MZN', 63.6666),
('USD', 'NAD', 16.5943),
('USD', 'NGN', 1369.4220),
('USD', 'NIO', 36.7600),
('USD', 'NOK', 9.2659),
('USD', 'NPR', 154.2164),
('USD', 'NZD', 1.7026),
('USD', 'OMR', 0.3845),
('USD', 'PAB', 1.0000),
('USD', 'PEN', 3.4304),
('USD', 'PGK', 4.3599),
('USD', 'PHP', 61.6970),
('USD', 'PKR', 278.6960),
('USD', 'PLN', 3.6405),
('USD', 'PYG', 6104.1817),
('USD', 'QAR', 3.6400),
('USD', 'RON', 4.4728),
('USD', 'RSD', 100.8184),
('USD', 'RUB', 72.5354),
('USD', 'RWF', 1466.7193),
('USD', 'SAR', 3.7500),
('USD', 'SBD', 7.9281),
('USD', 'SCR', 14.7977),
('USD', 'SDG', 454.2470),
('USD', 'SEK', 9.3897),
('USD', 'SGD', 1.2787),
('USD', 'SHP', 0.7456),
('USD', 'SLE', 24.5738),
('USD', 'SLL', 24573.8449),
('USD', 'SOS', 571.3094),
('USD', 'SRD', 37.1432),
('USD', 'SSP', 4717.6227),
('USD', 'STN', 21.0310),
('USD', 'SYP', 112.2427),
('USD', 'SZL', 16.5943),
('USD', 'THB', 32.5488),
('USD', 'TJS', 9.3195),
('USD', 'TMT', 3.4999),
('USD', 'TND', 2.9002),
('USD', 'TOP', 2.3365),
('USD', 'TRY', 45.5903),
('USD', 'TTD', 6.7515),
('USD', 'TVD', 1.3955),
('USD', 'TWD', 31.5950),
('USD', 'TZS', 2577.6573),
('USD', 'UAH', 44.1339),
('USD', 'UGX', 3729.7251),
('USD', 'UYU', 40.0668),
('USD', 'UZS', 11962.6828),
('USD', 'VES', 517.9619),
('USD', 'VND', 26256.0003),
('USD', 'VUV', 118.0290),
('USD', 'WST', 2.6864),
('USD', 'XAF', 563.0788),
('USD', 'XCD', 2.7000),
('USD', 'XCG', 1.7900),
('USD', 'XDR', 0.7303),
('USD', 'XOF', 563.0788),
('USD', 'XPF', 102.4356),
('USD', 'YER', 238.3375),
('USD', 'ZAR', 16.5940),
('USD', 'ZMW', 18.9122),
('USD', 'ZWG', 25.9184),
('USD', 'ZWL', 25.9184)

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

--DELIMITER ;

-- =====================================================
-- VIEW FOR QUICK SUMMARY(used in code directly)
-- =====================================================
CREATE VIEW v_wishlist_summary AS

SELECT
    w.id AS wishlist_id,
    u.id AS user_id
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
    WHERE u.id = current_user.id
    GROUP BY
        w.id,
        w.wishlist_name,
        u.name,
        u.home_currency;