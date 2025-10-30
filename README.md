-installed npm init
-created a server
-installed nodemon
-order of the routes matter a lot
-practice routing with +, *, /, ?, :, ()
-user ragex in the routing /a/, /.*?fly/
-installed postman and add routes 
-mongoDB connected successfully
-created a models folder for the shcema
-user schema created and userModel
-Created a post signup API to add data to database
-push a documents by the use of api call
-error handling using try , catch
-now start sending the dynamic data of the user frome the api
-we are start using the body of the api
-created get, post,delete,patch api 
-created a custom validator in the schema
-I dont want to updated my email id so I need to do some api lavel validation also
-Added data sanitization - By doing Api level validation 
-now lates validate the email Id field - Email Id should be valid (it's very tough to validate the email id so we can use a library email validator)
-db level validation is done for the email.
-write a validate function in the schema to check weather the photo url is valid string or not.
-added a strong password validator
-never trust the req.body {the attacker can send the some malicious data}
-created a utils folder with file validation.js and write validation while sign up the user
-now install a npm package bcrypt for hashing the password
-now create a login api with emailId , password with hashed password
-now adding the jwt and cookie authentications
-installed cookie-parser for reading the cookie from the req.body , build by express js
-installed jsonwebtoken(jwt)
-write the userAuth middleware for validations and add that middleware in the apis
-set the expiry of the cookies and jwt token so that user can't be login forever
-created a userSchema methods to jwt token
-created userSchema methods to comparePassword
-now creating apis for different routes (aap.use and router.use  is the same thing)
-created a logout api also , it can be more complicated in big applications
-created the apis like - profile edit , profile view and logout api
-added a coustom enum validator
-created a api for sending the connection request
-created a connection request schema 
created a schema method and pre function 
created a router for the connection request - api for connection request and make it secure by adding some validation
-implemented a $or , $and queries in mongoose- we have used index queries for the connection reaquest
-created a accepting request api
-use pouplate , ref for making the referance
-created a get api for reveive the request
-wrote the connection received request api 
-wrote the user connections  api 
-created feed api with some complicated query

-Now lets add paggination:-

=> /feed?page=1&limit=10 => 1-10 cards => .skip(0) & .limit(10)

=> /feed?page=2&limit=10 => 11-20 cards => .skip(10) & .limit(10)

=> /feed?page=3&limit=10 => 21-30 cards => .skip(20) & .limit(10)

skip = (page-1)*limit

-applied limit and skip fuction
