

import dotenv from "dotenv";
dotenv.config();

import jsonServer from "json-server";
import path from "path";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ShortUniqueId from "short-unique-id";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import config from "./config.js";

const serverPort = process.env.REACT_APP_JSON_SERVER_PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uid = new ShortUniqueId({ length: 10 });

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFileSync(file);
const db = new LowSync(adapter);
// db.read();
// db.data.users.push({ three: "four" });
// db.write();

const server = jsonServer.create();
// foreign key suffix as second parameter to the module. Below code sets it to dummy
// it fixes delete problem but causes expansion problems.
const router = jsonServer.router(join(__dirname, 'db.json'),{
  foreignKeySuffix: 'dummy'
});


const staticDir = path.join(__dirname, 'server-files');
const middlewares = jsonServer.defaults({static: staticDir});

server.use(middlewares);
server.use(jsonServer.bodyParser);
// server.use(express.static("public"));


// Authorization logic
server.use((req, res, next) => {
  let NeedsAuthorization = false;

  for (let i = 0; i < config.protectedRoutes.length; i++) {
    let { route, methods } = config.protectedRoutes[i];

    // if ((route === 'GET' && ))

    if ((req.url).startsWith(route)) {
      if (methods.includes(req.method)) {
        NeedsAuthorization = true;
        break;
      }
    }
  }

  if (NeedsAuthorization) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!authHeader || !token)
      return res
        .status(403)
        .send(
          "Its a protected route/method. You need an auth token to access it."
        );

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .send("Some error occurred wile verifying token.");
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

// default id & created at
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }

  if (req.method === "POST" && !req.body.id) {
    req.body.id = uid();
  }

  if (req.method === "POST" && req.user && !req.body.userId) {
    req.body.userId = req.user.id;
  }

  next();
});
server.post("/adminuser/register", (req, res) => {
  if (
    !req.body ||
    !req.body.username ||
    !req.body.password ||
    !req.body.email
  ) {
    return res
      .status(400)
      .send("Bad request, requires username, password & email.");
  }

  db.read();
  const users = db.data.adminUser;
  let largestId = 0;
  let storeId =0;
  users.forEach((user) => {
    if (user.id > largestId) largestId = user.id;
  });
  users.forEach((user) => {
    if (user.storeId > storeId) storeId = user.storeId;
  });

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const newId = largestId + 1;
  const newstoreId = storeId+1
  
  const newUserData = {
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    firstname: req.body.firstname || "",
    lastname: req.body.lastname || "",
    avatar: req.body.avatar || "",
    createdAt: Date.now(),
    id: newId,
    storeId :newstoreId,
  };

  db.data.adminUser.push(newUserData);

  db.write();

  res.status(201).send(newUserData);
});
server.post("/wishlist",(req,res)=>{
  if(
    !req.body.userId||
    !req.body.product
    ){
      return res
      .status(400)
      .send("Bad request, requires username, password & email.");
    }
    db.read()
    
    if(db.data.wishlist[`${req.body.userId}`]==undefined){
      db.data.wishlist[`${req.body.userId}`]=[req.body.product]
    }else{
      db.data.wishlist[`${req.body.userId}`].push(req.body.product)
    }
    db.write();

  res.status(201).send(db.data.wishlist[`${req.body.userId}`]);

})


server.post("/cart",(req,res)=>{
  if(
    !req.body.userId||
    !req.body.product
    ){
      return res
      .status(400)
      .send("Bad request, requires username, password & email.");
    }
    db.read()
    
    if(db.data.cart[`${req.body.userId}`]==undefined){
      db.data.cart[`${req.body.userId}`]=[req.body.product]
    }else{
      db.data.cart[`${req.body.userId}`].push(req.body.product)
    }
    db.write();

  res.status(201).send(db.data.cart[`${req.body.userId}`]);

})



server.post("/orders",(req,res)=>{
  if(
    !req.body.userId||
    !req.body.product
    ){
      return res
      .status(400)
      .send("Bad request, requires username, password & email.");
    }
    db.read()
    
    if(db.data.orders[`${req.body.userId}`]==undefined){
      db.data.orders[`${req.body.userId}`]=[req.body.product]
    }else{
      db.data.orders[`${req.body.userId}`].push(req.body.product)
    }
    db.write();

  res.status(201).send(db.data.orders[`${req.body.userId}`]);

})


server.post("/store",(req,res)=>{
  if (
    !req.body ||
    !req.body.storename ||
    !req.body.address||
    !req.body.contact||
    !req.body.userId
  ) {
    return res
      .status(400)
      .send("Bad request, requires username, password & email.");
  }

  db.read();
  const stores = db.data.stores;
  let largestId = 0;
  stores.forEach((store) => {
    if (store.id > largestId) largestId = store.id;
  });
  const newId = largestId + 1;


  const newStore = {
    storename:req.body.storename,
    address:req.body.address,
    contact:req.body.contact,
    createdAt: Date.now(),
    id: newId,
    userId:req.body.userId
  };
  db.data.stores.push(newStore);

  db.write();

  res.status(201).send(newStore);
})



server.post("/add",(req,res)=>{
  if (
    !req.body ||
    !req.body.productName ||
    !req.body.price||
    !req.body.offer||
    !req.body.image||
    !req.body.review||
    !req.body.storeId
  ) {
    return res
      .status(400)
      .send("Bad request, requires username, password & email.");
  }

  db.read();
  const products = db.data.products;
  let largestId = 0;
  products.forEach((product) => {
    if (product.id > largestId) largestId = product.id;
  });
  const newId = largestId + 1;


  const newProd = {
    productName: req.body.productName,
    price: req.body.price,
    offer: req.body.offer ,
    elite: req.body.elite ,
    image:req.body.image,
    review:req.body.review,
    createdAt: Date.now(),
    productId: newId,
    storeId:req.body.storeId
  };
  db.data.products.push(newProd);

  db.write();

  res.status(201).send(newProd);
})

// registration logic
server.post("/user/register", (req, res) => {
  if (
    !req.body ||
    !req.body.password ||
    !req.body.email
  ) {
    return res
      .status(400)
      .send("Bad request, requires username, password & email.");
  }

  db.read();
  const users = db.data.users;
  let largestId = 0;
  users.forEach((user) => {
    if (user.id > largestId) largestId = user.id;
  });

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const newId = largestId + 1;
  
  const newUserData = {
    password: hashedPassword,
    email: req.body.email,
    firstname: req.body.firstname || "",
    lastname: req.body.lastname || "",
    createdAt: Date.now(),
    id: newId,
  };

  db.data.users.push(newUserData);

  db.write();

  res.status(201).send(newUserData);
});

// login/sign in logic
server.post("/user/login", (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .send("Bad request, requires username & password both.");
  }

  db.read();
  const users = db.data.users;
  const user = users.find((u) => u.email === req.body.email);
  if (user == null) {
    return res.status(400).send(`Cannot find user: ${req.body.email}`);
  }

  if (bcrypt.compareSync(req.body.password, user.password)) {
    // creating JWT token
    const accessToken = generateAccessToken(user);
    return res.send({
      accessToken: accessToken,
      user: user
    });
  } else {
    res.send("Not allowed, name/password mismatch.");
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });
}

// To modify responses, overwrite router.render method:
// In this example, returned resources will be wrapped in a body property
// router.render = (req, res) => {
//   res.jsonp({
//     body: res.locals.data,
//   });
// };

server.use(router);

server.listen( serverPort, () => {
  console.log(
    `JSON Server is running at http://localhost:${serverPort}`
  );
});
