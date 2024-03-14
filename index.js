const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const authRoute = require("./routes/authRoutes");
const productRoute = require("./routes/productRoutes");
const blogRoutes = require("./routes/blogRoutes");
const productCategoryRoutes = require('./routes/productCategoryRoute');
const blogCategoryRoutes = require('./routes/blogCategoryRoute');
const brandRoutes = require('./routes/brandRoute');
const couponRoutes = require('./routes/couponRoutes');
const bodyParser = require('body-parser');
const {notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser =  require('cookie-parser');
const morgan = require('morgan');

//dbConnect
dbConnect();

// logger middleware 
app.use(morgan());
//bodyparser()
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended:false}));
//middleware for parsing cookies
app.use(cookieParser());

//routes
app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoutes);
app.use("/api/category", productCategoryRoutes);
app.use("/api/bcategory", blogCategoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/coupon", couponRoutes);


//error handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server is Running on ${PORT}.`);
})