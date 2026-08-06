// Section A: Data Types Practice

let name = "Paschal";
let age = 49;
let student_status = True;

console.log(name, age, student_status);
console.log(typeof(name));
console.log(typeof(age));
console.log(typeof(student_status));

let shoppingList = ['orange', 'fruit', 9, "BokkuMart"]
console.log(typeof(shoppingList))


// Section B: Arithmetic Operators
let num1 = 8;
let num2 = 6;

let sum = num1 + num2;
let diff = num1 - num2;
let prod = num1 * num2;
let quot = num1 / num2;

console.log(sum, diff, prod, quot);
console.log(17 % 5);

let price = 1500;
let discount = 200;
let final_price = price - discount;
console.log(final_price);


// Section C: Comparison Operators
let a = 10;
let b = "10"
console.log(a == b);
console.log(a === b);

// Add a comment explaining why they differ.
let score = 75;
console.log(score >= 50);
// For the Double Equal sign (==), 
// Javascript compares the values of both variables
// While for the Triple Equal sign (===),
//Javascript compares both data type and values of the variables.


//Section D: Logical Operators
let hasTicket = true;
let hasID = false;
console.log(hasTicket && hasID);
console.log(hasTicket || hasID);


// Section E: Mini Project
let password = "1234";
let correctPassword = "1234";
console.log(password === correctPassword);

let budget = 5000;
let itemPrice = 1200;
console.log(itemPrice < budget && budget > 0);