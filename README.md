# Advanced E-Commerce Platform

Author: Byron Smith

Date: 1/10/2025

Welcome to the Advanced E-Commerce Platform! _Note_: use the following credentials to log in for testing:

username: johnd
password: m38rmF$

### Table of Contents
1.  Features
2.  Navigation Bar
3.  Login Page
4.  Create User Account Page
5.  Home Page
6.  View Cart Page
7.  Order History Page
8.  Update User Account Page

## 1. Features
  - Secure Login to ensure your details are not compromised
  - Simple form for creating an account
  - Form for changing account information, complete with an option to delete your account
  - A home page that displays all of the products on sale
  - Search, sort, and filter-by-category functions to make your browsing easier
  - An organized and easy-to-read cart
  - A way to view your order history, check when it was ordered, and see how much you paid for everything
  - A convinient navbar placed on every page for your navigating convinience
  - Options to switch langauges between English and French (support for more languages may come in a later update)

## 2. Navigation Bar
![navbar](https://github.com/user-attachments/assets/f4c88398-149a-4cd1-8dd1-a2bc46e3b695)

The Navigation Bar will take you to wherever you need to go. However, it should be noted that __you will only have access to the program's features if you are logged in.__ 
If you are not, the program will redirect you to the Login page. To log out, click the red Logout button on the top right of the Navigation Bar, which will also direct you to the login page.

![login_french](https://github.com/user-attachments/assets/5b8538eb-98e9-4ba0-ab08-b1b4f9943bdc)

The Navigation bar also has tabs for changing the language from English to French. Currently, these are the only options, but support for more languages may come in a later update.

## 3. Login Page
![login_en](https://github.com/user-attachments/assets/723b852e-65bf-4f36-856c-d7f2cbdcfa2e)

The Login Page contains the Navigation Bar; a form for entering in your username and password; and a link to the Creat User Account Page for those who do not have an account.
The program compares your credentials to ones stored on their database, and if they match, it will grant you access to the rest of the program.

## 4. Create User Account Page
![createaccount](https://github.com/user-attachments/assets/145f979b-9c0a-47a5-9284-04bbcba8096a)

The Create User Account Page contains a form for you to enter in your account information. This includes:

- A Username and Password, unique to your account
- Contact information, including Email and Phone Number
- Lines for your Address, including City, Street Address, and Zip Code

You must fill out ALL parts of the form in order to proceed. Your information will not be shared with anyone.

## 5. Home Page
![home](https://github.com/user-attachments/assets/5994dcb3-6727-4194-b342-dd595591a5ea)

Once you've created an account and logged in, the program will take you to the Home Page. Here, you can view various products and add them to your cart. There are ways to narrow down your search, including:
-An option to filter by category:
![filter](https://github.com/user-attachments/assets/49345919-53ab-418b-b118-cfd9d8c6f280)

-A tab for sorting items by their name, category, and price, ascending or descending:
![sort](https://github.com/user-attachments/assets/ab4d2ead-d6d5-447e-8f45-940248652161)

-And a search function, where you can search by name, or display products within a certain range of prices:
![search](https://github.com/user-attachments/assets/2e770013-c6e1-4f2f-967d-2ae7aeb42a81)\

All of these are dynamic, meaning that the page's display will change as you choose your options.

## 6. View Cart Page
![viewcart](https://github.com/user-attachments/assets/fbfa3f63-f4c0-4320-af76-d376547f07b2)

There are 2 ways to access this page:

1. By Clicking on the View Cart tab on the Navigation Bar
2. By Clicking the link on the home page that tells you how much you have in your cart, located underneath the welcome message.

Here you can view whatever you put in your cart. When there are items in the cart, it will look like this:
![cartfull](https://github.com/user-attachments/assets/114cfdbd-87c6-45ae-8b53-649d78e9e527)

To increase or decrease the amount of each item in your cart, simply click the + or - buttons. To remove items from your cart, click the "Remove from Cart" button.
If you want to return to the Home Page, you can either use the Navigation Bar or click the "Return to Home" button at the bottom of the cart. To checkout, click the checkout button, also located
at the bottom of the cart.

## 7. Order History Page
![orderhistory](https://github.com/user-attachments/assets/0b24ebca-ae18-41b5-b394-4f33e75a9827)

If you would like to view your past orders, click the Order History tab on the Navigation Bar. This will take you to a page that displays your past orders by ID. On the surface, it only dispalys
Order ID, Order Date, and Total Cost, but if you would like to view individual products and their details, click on the View Details button on each order.

## 8. Update User Account Page
![update_account](https://github.com/user-attachments/assets/07f9faf1-f2fb-4aea-861e-d96f0dee323d)

The Update User Account Page is structured much like the Create User Account page, for simplicity. It will automatically fill in the details of your account, where you can change details like your 
email address, phone number, username, and password. 
Unlike the Create User Account page, however, the Update User Account Page includes a button for deleting your account, should you choose to. It will give you a warning, stating that the action 
is irreversible. If you did not intend to delete your account, or if you changed your mind, click the cancel button. Otherwise, the program will delete your account when you click the delete button.

__Warning__: this is __irreversable__. Once it is deleted, it is irrecoverable, and you will have to create a new account. 



**API used for this project: [Fake Store API](https://fakeapistore.com/ "FakeAPIStore.com")**

