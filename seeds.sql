USE bamazon_db;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("OGX Shampoo", "Cosmetics", 10.66, 300),
       ("OGX Conditioner", "Cosmetics", 18.02, 400),
       ("Carrots", "Grocery", 7.99, 400),
       ("Marinara Sauce", "Grocery", 5.99, 500),
       ("Dove Soap", "Cosmetics", 6.07, 700),
       ("Kleenex Facial Tissue", "Cosmetics", 13.29, 800),
       ("Scott Toilet Paper", "Grocery", 7.04, 300),
       ("Huggies Pull Ups", "Children", 30.45, 900),
       ("Banana", "Grocery", 4.99, 950),
       ("Tylenol", "Pharmacy", 12.05, 600);

SELECT * FROM products;

