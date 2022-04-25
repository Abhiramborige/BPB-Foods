const express = require("express");
const jsonData = require("./public/recipes.json");
var userData = require("./public/users.json");
var bodyParser = require('body-parser')
const app = express();
const port = 3000;
const EventEmitter = require("events");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let cart = [];
var loggedin=null;
var registered_user=null;
const myEmitter = new EventEmitter();
const addToCart = (obj) => {
  cart.push(obj);
  console.log("In addToCart")
  console.log(obj);
};
myEmitter.on("addToCart", addToCart);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("home", { count: cart.length, user:loggedin });
});
app.get("/login", (req, res) => {
  res.render("login", { count: cart.length, user:loggedin });
});
app.get("/cart", (req, res) => {
  res.render("cart", {
    recipies: cart,
    count: cart.length,
    user:loggedin
  });
});
app.post("/checkuser",(req, res)=>{
  console.log(req.body)
  let username=req.body.username;
  let password=req.body.password;
  let users=userData.users;
  for(var i=0; i<users.length; i++){
    if(username===users[i].username && password===users[i].password){
      loggedin=username;
      console.log(username)
      break;
    }
  }
  if(loggedin===null){
    if(registered_user[0]==username && registered_user[1]==password){
      loggedin=username;
    }
    if(loggedin===null)
      res.sendStatus(404)
  }
  else
    res.redirect("/catalouge");
})
app.post("/register",(req, res)=>{
  let username=req.body.username;
  let password=req.body.password;
  registered_user=[username, password];
  loggedin=registered_user[0];
  res.redirect("/login")
})
app.post("/add",(req, res)=>{
  console.log("In /add")
  console.log(req.body)
  var recipies=jsonData.products;
  for(var i=0; i<recipies.length; i++){
    if(recipies[i].id==req.body.id){
      myEmitter.emit("addToCart",recipies[i]);
      res.redirect("/cart",{
        recipies: cart,
        count: cart.length,
      });
      break;
    }
  }
})
app.get("/catalouge", (req, res) => {
  res.render("products", {
    products: jsonData.products,
    count: cart.length,
    user:loggedin
  });
});
app.post("/logout",(req, res)=>{
  loggedin=null;
  res.redirect("/");
})
app.get('/:prod_id', (req, res) => {
  var id=req.params.prod_id;
  const products=jsonData.products;
  var req=null;
  for(var i=0; i<products.length; i++){
    if(products[i].id==id){
      req=products[i];
      break;
    }
  }
  res.render("recipie", { count: cart.length, recipe:req, user:loggedin });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
