# ABC Fitness React

This project is a rebuild of my previous of my last repo: https://abcfitnesslab.netlify.app

Link to the new project: https://abcfitness-react.onrender.com

The stack that was used for this project was: mongodb, expressjs, reactjs, and lastly nodejs.
Tailwind CSS used for front end development. 


## The back routes:

  app.use('/api/user', userRoutes);

  app.use('/api/products', productRoutes);

  app.use('/api/trainer', trainerRoutes);

  app.use('/api/admin', adminRoutes);

  app.use('/api/cart', cartRoutes);
  
  app.use('/api/payment', PaymentRoutes);

## 🛣️ The Routes in depth: 
 
   User Routes: Users can book classes, purchase products, delete their accounts, and view their history of booked classes and purchased products. The authentication controller is also located within the user routes. It uses bcrypt, JSON Web Tokens (JWT), and cookie-parser. When a user creates an account, a token is generated to authenticate the user during login. This includes both access and refresh tokens. The access token is refreshed every 15 minutes using Redis. The access token is used to log in to the account, and passwords are hashed using bcrypt. Middleware checks are implemented to determine if the user is an admin or has a trainer profile.

  Product Routes: Half of the routes are public, used for the product listing and product detail pages. The other half is restricted to admin accounts for creating, updating, and deleting products.
Trainer Routes: Trainers can host classes, edit their classes, and delete them.

  Admin Routes: Admins can view all users registered on the platform. They have the ability to promote users to trainer status, after which trainers can set up their profiles. Admins can view all transactions and have the authority to delete users and products.
Cart Routes: These routes are for customers to manage their shopping cart. Users can add products, delete items, and update quantities.

  Payment Routes: These routes generate a session with Stripe. Once an order is placed, the user is redirected to a success page.
All endpoints have been tested in the backend before integration with the frontend.

## Running the project 
Clone this project ```git clone```. Once the project has been cloned; cd into the main directory and install the dependencies by running ```npm run install```,
Before running the project, ensure that you’ve created a .env file with all the required environment variables as outlined in the Environment Setup section. Also, make sure that external services such as MongoDB, Redis, Stripe, and any email services are properly configured and running as those are needed in order to run this project, after you have successfully configured variables, navigate to the main directory and run ```npm run build``` this will generate "dist" folder in the frontend. Once the build is complete, return to the main directory and start the backend server with npm run dev. To run the frontend in development mode, navigate into the frontend directory and run npm run dev. 

# Environment Setup
Create a ```.env``` file at the root of the root directory and add the following configuration variables:

  PORT=3000
  MONGO_URI= your_mongo_uri_here

  ## put back to 3000 to deploy or put 5173 for local testing

  CLIENT_URL=http://localhost:3000

  #CLIENT_URL=https://abcfitness-react.onrender.com

  ## change to production for deployment and change to development for local testing

  NODE_ENV=production

  ## CLOUDINARY CREDS 
  CLOUDINARY_CLOUD_NAME= your_cloudinary_cloud_name_here

  CLOUDINARY_API_KEY= your_cloudinary_secret_api_key

  CLOUDINARY_API_SECRET_KEY= your_cloudinary_api_secret_key_here

  ## REDIS 
  REDIS_URL= your_redis_url_here

  ## ACCESS AND REFRESH TOKENS

  ACCESS_TOKEN_SECRET= your_access_token_secret_here

  REFRESH_TOKEN_SECRET= your_refresh_token_secret_here

  ## STRIPE SECRET KEY

  STRIPE_SECRET_KEY= your_stripe_secret_key_here

  VITE_STRIPE_PUBLISHABLE_KEY= your_stripe_publishable_key_here

  ## EMAIL SERVICE

  EMAIL_USER= your_email_here

  EMAIL_PASS= your_email_app_password_here

## Email Setup

This project uses email functionality. To enable it:

1. Get your email credentials:
   - **Gmail**: Enable 2FA and create an [App Password](https://support.google.com/accounts/answer/185833)
   - **SendGrid**: Sign up and get an API key
   - **Other**: Use your SMTP credentials

2. Add to your `.env` file:
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail 
```

## 🚨 IMPORTANT 🚨

Users will receive an email via Nodemailer when creating an account, resetting their password, or purchasing a product. Please note: when making a purchase, refer to the image below for implementation details.

<img width="1385" height="1031" alt="image" src="https://github.com/user-attachments/assets/96400446-bc98-48ff-9427-f9cf844bf5f3" />
