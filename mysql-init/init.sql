CREATE DATABASE IF NOT EXISTS raddb;
CREATE USER IF NOT EXISTS 'raduser'@'%' IDENTIFIED BY 'radpassword';
GRANT ALL PRIVILEGES ON raddb.* TO 'raduser'@'%';
FLUSH PRIVILEGES;

-- Create tpms_data table if not exists
CREATE TABLE IF NOT EXISTS raddb.tpms_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME,
    model VARCHAR(255),
    sensor_id VARCHAR(255),
    pressure_PSI FLOAT,
    temperature_C FLOAT,
    rssi FLOAT
);