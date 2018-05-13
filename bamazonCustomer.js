var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    //   connection.end();
});

//Validate the User Input to make sure User provides Integer input
function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign == 1)) {
        return true;
    }
    else {
        return "Please enter a whole number."
    }
}

//Prompt User for the item and quantity they want to purchase
function promptUser() {
    // console.log("Enter User Purchase details");

    //Prompt user to select an item
    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: "Please enter an item you would like to purchase.",
            validate: validateInput,
            filter: Number
        },

        {
            type: "input",
            name: "quantity",
            message: "Please enter the quantity of product you need.",
            validate: validateInput,
            filter: Number

        }
    ]).then(function (input) {

        // console.log('Customer has selected: \n    item_id = '  + input.item_id + '\n    quantity = ' + input.quantity);

        var item = input.item_id;
        var quantity = input.quantity;

        //Query for validation
        var qry = "SELECT * FROM products where ?";

        connection.query(qry, {"item_id":item}, function (err, data) {
            if (err) {
                console.log(connection.query)
                throw err;
            }

            // If the user has selected an invalid item ID, data array will be empty
            // console.log('data = ' + JSON.stringify(data));

            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID. \n');
                displayInventory();
            }
            else {
                var productData = data[0];

                // console.log('productData = ' + JSON.stringify(productData));
                // console.log('productData.stock_quantity = ' + productData.stock_quantity);

                //If quantity is available
                if (quantity <= productData.stock_quantity) {
                    console.log("The product you requested is availble in stock!!");

                    //Update the query 
                    var updateQuery = "UPDATE products SET stock_quantity = " + (productData.stock_quantity - quantity) + " WHERE item_id = " + item;

                    // console.log("Updated query" + updateQuery);

                    //Updating the inventory
                    connection.query(updateQuery, function (err, data) {
                        if (err) throw err;

                        console.log('Your order has been placed! Your total is $' + productData.price * quantity);
                        console.log('Thank you for shopping with us!');
                        console.log("\n---------------------------------------------------------------------\n");

                        // End the database connection
                        connection.end();
                    })
                } else {
                    console.log('Sorry, there is no enough product available in stock, your order cannot be placed now.');
                    console.log('Please modify your order.');
                    console.log("\n---------------------------------------------------------------------\n");

                    displayInventory();
                }
            }
        })
    })
}

//Retrieve the inventory info from the database
function displayInventory() {
    // console.log("Display the inventory available");

    var qry = "SELECT * FROM products";

    //Connection to the query
    connection.query(qry, function (err, data) {
        if (err) throw err;

        console.log('Existing Inventory: ');
        console.log('*******************\n');

        var str = "";
        for (var i = 0; i < data.length; i++) {
            str = " ";
            str += "Item ID: " + data[i].item_id + "\n";
            str += "Product Name: " + data[i].product_name + "\n";
            str += "Department: " + data[i].department_name + "\n";
            str += "Price: $" + data[i].price + "\n";

            console.log(str);
        }

        console.log("*****************************\n");

        //Prompt User for the item they want to purchase
        promptUser();
    })
}

//Executing the main fn
function runBamazon() {
    
    displayInventory();
}

runBamazon();



