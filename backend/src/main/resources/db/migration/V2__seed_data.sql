-- ============================================================
-- CrowdAid Seed Data - V2
-- ============================================================

-- Insert default roles
INSERT IGNORE INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_HELPER'), ('ROLE_ADMIN');

-- Insert admin user (password: Admin@123)
INSERT IGNORE INTO users (full_name, email, password, phone, trust_score, is_verified, is_active)
VALUES (
    'System Admin',
    'admin@crowdaid.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiKQ0.p7D3Vu',
    '+1234567890',
    100.0,
    TRUE,
    TRUE
);

-- Assign ADMIN role to admin user
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'admin@crowdaid.com' AND r.name IN ('ROLE_USER', 'ROLE_ADMIN');

-- Insert demo helper (password: Helper@123)
INSERT IGNORE INTO users (full_name, email, password, phone, trust_score, is_verified, is_active, is_available, latitude, longitude)
VALUES (
    'John Helper',
    'helper@crowdaid.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uSauG7', -- Helper@123 placeholder
    '+1987654321',
    75.0,
    TRUE,
    TRUE,
    TRUE,
    37.7749,
    -122.4194
);

-- Assign HELPER role
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'helper@crowdaid.com' AND r.name IN ('ROLE_USER', 'ROLE_HELPER');
