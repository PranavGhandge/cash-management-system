 CREATE DATABASE cash_management;
USE cash_management;

CREATE TABLE cash_balance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE,
  note_500 INT DEFAULT 0,
  note_200 INT DEFAULT 0,
  note_100 INT DEFAULT 0,
  note_50 INT DEFAULT 0,
  note_20 INT DEFAULT 0,
  note_10 INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100),
  type ENUM('withdrawal', 'deposit'),
  amount DECIMAL(10,2),
  note_500 INT DEFAULT 0,
  note_200 INT DEFAULT 0,
  note_100 INT DEFAULT 0,
  note_50 INT DEFAULT 0,
  note_20 INT DEFAULT 0,
  note_10 INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from cash_balance;
select * from transactions;


ALTER TABLE transactions
ADD COLUMN bank_name VARCHAR(100);

POST /opening
{
  "note_500": 100,
  "note_200": 50,
  "note_100": 20
}


POST /transaction
{
  "customer_name": "Rahul",
  "type": "withdrawal",
  "note_500": 2,
  "note_100": 3
}
{
  "customer_name": "Amit",
  "type": "deposit",
  "note_500": 5
}


GET /balance
GET /report

https://chatgpt.com/share/69f72ef6-f9e0-83e8-80e3-98a0f8c302b8
