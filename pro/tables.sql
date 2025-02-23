USE project;


-- Sessions Table
CREATE TABLE Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expiry_time DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_login(id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- Procedure to Clean Expired Sessions
DELIMITER $$
CREATE PROCEDURE CleanupExpiredSessions()
BEGIN
    DELETE FROM Sessions WHERE expiry_time < NOW();
END $$
DELIMITER ;

-- Event to Auto-Clean Expired Sessions Every 30 Minutes
CREATE EVENT ExpiredSessionCleanup
ON SCHEDULE EVERY 30 MINUTE
DO CALL CleanupExpiredSessions();

-- Enable Event Scheduler
SET GLOBAL event_scheduler = ON;
