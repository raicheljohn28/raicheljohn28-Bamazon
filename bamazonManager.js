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

function promptManager() {
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message : "Please enter an option: ",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            filter: function(value) {
                if(value === "View Products for Sale") {
                    return "sale";
                }
                else if(value === "View Low Inventory") {
                    return "lowInventory";
                }
                else if(value === "Add to Inventory") {
                    return "addInventory";
                }
                else if(value === "Add New Product") {
                    return "newProduct";
                }
            }

        }
    ]).then(function(input) {
        if(input.option === "sale") {
            displayInventory(); 
        }
        else if(input.option === "lowInventory") {
            displayLowInventory();
        }
        else if(input.option === "addInventory") {
            addInventory();
        }
        else if(input.option === "newProduct") {
            createNewProduct();
        }
        else {
            console.log("ERROR: Please choose from the options given!");
            exit();
        }

    })
}

function displayInventory() {
    var query = "SELECT * FROM products";

    connection.query(query, function(err, data) {
        if(err) throw err;

        console.log("Inventory Exists: ");
        console.log("*****************\n");

        var str = " ";
        for(var i = 0; i < data.length; i++) {
            str = " ";
            str += "Item ID: " + data[i].item_id + "\n";
            str += "Product Name: " + data[i].product_name + "\n";
            str += "Department: " + data[i].department_name + "\n";
            str += "Price: $" + data[i].price + "\n";
            str += 'Quantity: ' + data[i].stock_quantity + "\n";

            console.log(str);
        }

        connection.end();
    })
}

function displayLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 500";

    connection.query(query, function (err, data) {
        if (err) throw err;

        console.log('Low Inventory Items: ');
        console.log('*******************\n');

        var str = "";
        for (var i = 0; i < data.length; i++) {
            str = " ";
            str += "Item ID: " + data[i].item_id + "\n";
            str += "Product Name: " + data[i].product_name + "\n";
            str += "Department: " + data[i].department_name + "\n";
            str += "Price: $" + data[i].price + "\n";
            str += 'Quantity: ' + data[i].stock_quantity + "\n";

            console.log(str);
        }

        console.log("*****************************\n");

        connection.end();
    })
}

function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole number.';
	}
}

// validateNumeric makes sure that the user enters only positive number input
function validateNumeric(value) {
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number for the unit price.'
	}
}

function addInventory() {

    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: "Please enter the Item ID for updating the product.",
            validate: validateInteger,
            filter: Number

        },
        {
            type: "input",
            name: "quantity",
            message: "How many do you want to add?",
            validate: validateInteger,
            filter: Number

        }
    ]).then(function(input) {
        var item = input.item_id;
        var addQuantity = input.quantity;

        var query = "SELECT * FROM products WHERE ?";

        connection.query(query, {item_id: item}, function(err, data) {
            if(err) throw err;

            if(data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                addInventory();
            }
            else {
                var productData = data[0];

                console.log("Updating inventory....");

                var updateQuery = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
                // console.log('updateQueryStr = ' + updateQuery);

                connection.query(updateQuery, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
					console.log("\n--------------------------------------------\n");

					// End the database connection
                    connection.end();
                })
            }
        })
    })
}

function createNewProduct() {
    inquirer.prompt([
        {
            type: 'input',
			name: 'product_name',
			message: 'Please enter the new product name.',
        },
        {
            type: 'input',
			name: 'department_name',
			message: 'Please add the appropriate department to which the product belongs.',
        },
        {
            type: 'input',
			name: 'price',
			message: 'What is the price per unit?'
        },
        {
            type: 'input',
			name: 'stock_quantity',
			message: 'How many items are in stock?'
        }
    ]).then(function(input) {
        console.log("Adding the new product: \n product_name = " + input.product_name + "\n" + "department_name = " + input.department_name + "\n" + "price = " + input.price + "\n" + "stock_quantity = " + input.stock_quantity);

        var query = "INSERT INTO products SET ?";

        connection.query(query, input, function(error, results, fields) {
            if(error) throw error;

            console.log("New product has been added to the inventory: " + results.insertId + ".");
            
            console.log("*****************************\n");

            connection.end();
        });
    })
}

function runBamazon() {

    //Prompt Manager function for input
    promptManager();

}

//Run the logic
runBamazon();


