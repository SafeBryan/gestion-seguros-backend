-- init.sql
CREATE USER IF NOT EXISTS 'safebryan'@'%' IDENTIFIED BY '081012';
GRANT ALL PRIVILEGES ON *.* TO 'safebryan'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
