const express = require('express');
const app = express();
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
const Puzzle = require('./models/puzzle');
const Order = require('./models/order');
const Cart = require('./models/cart');
const pagination = require('./utils/pagination');
const apiRoutes = require('./routes/api/user');
const fs = require('fs-extra-promise');
const { storage, uploadsDir, uploadsFullPath } = require('./multerStorage');
const PORT = parseInt(process.argv[2]) || process.env.PORT || 12010;


const mongoose = require('mongoose');
const dbUrl = require('./utils/db_connection');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const DEFAULT_TEMP_USER_ID = '5dab2bc38e8a7937749f1adf';
let DEFAULT_TEMP_CART_ID = '5dac39298ba6d20308f9d07d';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to mongoDB');
        app.listen(PORT,
            () => console.log(`Server is ready on port ${PORT}`));
        User.getById(DEFAULT_TEMP_USER_ID).then(user => {
            DEFAULT_TEMP_CART_ID = user.cart._id;
        });
    })
    .catch(err => console.log(`Mongo Error: ${err}`));

const PAGE_SIZE = 6;

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.use(storage.single("image"));

const partialsDir = path.join(viewsDir, "partials");
app.engine('mst', mustache(partialsDir));
app.set('view engine', 'mst');

app.use('/api', apiRoutes);


app.get('/', function (req, res) {
    res.render('index', { title: 'Интернет-магазин "Кубанутый"', cartId: DEFAULT_TEMP_CART_ID, userId: DEFAULT_TEMP_USER_ID });
});

app.post('/puzzles', urlencodedParser, (req, res) => {
    const puzzleId = req.body.puzzle_id;
    User.getById(DEFAULT_TEMP_USER_ID).then(user => {
        if (!user.cart) {
            user.cart = new Cart(user);
            Promise.all([User.insert(user),
            Cart.insert(user.cart)]).
                then(([]) => {
                    Cart.insertPuzzle(user.cart, puzzleId).then(() => {
                        res.redirect('#');
                    });
                });
        } else {
            Cart.insertPuzzle(user.cart, puzzleId).then(() => {
                res.redirect('#');
            });
        }
    }).catch(console.error);
});


app.get('/puzzles', function (req, res) {
    const searchName = req.query.name || '';
    console.log(req.query); // i will not get rid of it!))
    const pageNum = parseInt(req.query.page) || 1;
    Puzzle.getByNameLike(searchName, pageNum, PAGE_SIZE).
        then(([puzzles, fullLength]) => {
            const pagesCount = pagination.getPagesCount(fullLength, PAGE_SIZE);
            const pages = pagination.getArrayOfPageIndexes(pagesCount);
            Puzzle.getFilters().then((filters) => {
                res.render('puzzles', {
                    title: 'Интернет-магазин "Кубанутый"',
                    items: puzzles,
                    searchName: searchName,
                    filters: filters,
                    pages: pages,
                    cartId: DEFAULT_TEMP_CART_ID,
                    userId: DEFAULT_TEMP_USER_ID
                });
            }).
                catch(err => processErr(err, res));
        }).
        catch(err => processErr(err, res));
});



app.get('/puzzles/:id([\\da-z]{24})', urlencodedParser, function (req, res) {
    const puzzle_id = req.params.id;
    Puzzle.getById(puzzle_id).
        then(puzzle => {
            if (!puzzle) {
                res.status(404).render('404', {
                    userId: DEFAULT_TEMP_USER_ID,
                    cartId: DEFAULT_TEMP_CART_ID
                });
                return;
            }
            const promises = [Puzzle.getTypeById(puzzle.typeId),
            Puzzle.getManufacturerById(puzzle.manufacturerId)];

            Promise.all(promises).
                then(([type, manuf]) => {
                    puzzle.type = type;
                    puzzle.manufacturer = manuf;
                    res.render('puzzle', {
                        puzzle: puzzle, cartId: DEFAULT_TEMP_CART_ID,
                        userId: DEFAULT_TEMP_USER_ID
                    });
                }).
                catch(err => processErr(err, res));

        }).
        catch(err => processErr(err, res));
});

app.post('/puzzles/:id([\\da-z]{24})', (req, res) => {
    const puzzleId = req.params.id;
    const method = req.query._method || 'POST';
    if (method === 'DELETE') {
        Puzzle.deleteById(puzzleId).
            then(() => {
                res.redirect('/puzzles');
            }).
            catch(err => processErr(err, res));
    } else if (method === 'POST') {
        User.getById(DEFAULT_TEMP_USER_ID).then(user => {
            if (!user.cart) {
                user.cart = new Cart(user);
                Promise.all([User.insert(user),
                Cart.insert(user.cart)]).
                    then(([]) => {
                        Cart.insertPuzzle(user.cart, puzzleId).then(() => {
                            res.redirect('#');
                        });
                    });
            } else {
                Cart.insertPuzzle(user.cart, puzzleId).then(() => {
                    res.redirect('#');
                });
            }
        }).catch(console.error);
    }
});

app.get('/data/fs/:filename', (req, res) => {
    const fullPath = `${uploadsFullPath}/${req.params.filename}`;
    fs.readFileAsync(fullPath).
        then((data) => {
            res.contentType('image/jpeg');
            res.send(data);
        }).
        catch(err => processErr(err, res));
});



app.get('/puzzles/new', (req, res) => {
    Puzzle.getFilters().
        then((filters) => {
            res.render('puzzlesNew', {
                title: 'Новая головоломка',
                filters,
                cartId: DEFAULT_TEMP_CART_ID,
                userId: DEFAULT_TEMP_USER_ID
            });
        }).
        catch(err => processErr(err, res));
});


app.post('/puzzles/new', (req, res) => {
    Puzzle.getPuzzleFromFormRequest(req).then(puzzle => {
        Puzzle.insert(puzzle).
        then((puzzle) => {
            res.redirect(`/puzzles/${puzzle.id}`);
        }).
        catch(err => processErr(err, res));
    });
});



app.get('/users', function (req, res) {
    User.getAll().
        then((users) => {
            users.forEach(user => {
                [user.first_name, user.last_name] = user.fullname.split(' ');
            });
            res.render('users', { users: users, cartId: DEFAULT_TEMP_CART_ID, userId: DEFAULT_TEMP_USER_ID });
        }).
        catch(err => processErr(err, res));
});


app.get('/users/:id([\\da-z]{24})', function (req, res) {
    const user_id = req.params.id;
    User.getById(user_id).
        then(user => {
            if (!user)
                res.status(404).render('404', { user: user, cartId: DEFAULT_TEMP_CART_ID, userId: DEFAULT_TEMP_USER_ID });
            else
                res.render('user', { user: user, cartId: DEFAULT_TEMP_CART_ID, userId: DEFAULT_TEMP_USER_ID });
        }).
        catch(err => processErr(err, res));
});


app.get('/about', function (req, res) {
    res.render('about', { cartId: DEFAULT_TEMP_CART_ID, userId: DEFAULT_TEMP_USER_ID });
});

app.get('/orders', function (req, res) {
    //@todo pagination here
    Order.getAll().
        then(orders => {
            res.render('orders', { orders: orders, cartId: DEFAULT_TEMP_CART_ID, userId: DEFAULT_TEMP_USER_ID });
        }).
        catch(err => processErr(err, res));
});

app.get('/orders/:id([\\da-z]{24})', (req, res) => {
    const orderId = req.params.id;
    Order.getById(orderId).then(order => {
        Cart.getById(order.cart._id).then(cart => {
            const count = Cart.getPuzzlesCount(cart);
            res.render('order', {
                cart: cart,
                order: order,
                count: count,
                userId: DEFAULT_TEMP_USER_ID,
                cartId: DEFAULT_TEMP_CART_ID
            });
        }).catch(err => processErr(err, res));
    }).catch(err => processErr(err, res));
});

app.get('/cart/:id([\\da-z]{24})', (req, res) => {
    const cartId = req.params.id;
    Cart.getById(cartId).then(cart => {
        const fullPrice = Cart.getFullPrice(cart);
        const fullCount = Cart.getPuzzlesCount(cart);
        res.render('cart', {
            cart: cart,
            price: fullPrice,
            count: fullCount,
            userId: DEFAULT_TEMP_USER_ID,
            cartId: DEFAULT_TEMP_CART_ID
        });
    }).catch(err => processErr(err, res));
});


app.post('/cart/:id([\\da-z]{24})', (req, res) => {
    const cartId = req.params.id;
    Cart.getById(cartId).then((cart) => {
        const price = Cart.getFullPrice(cart);
        const order = new Order(cartId, DEFAULT_TEMP_USER_ID, price);
        Promise.all([Order.insert(order), User.setNewCart(DEFAULT_TEMP_USER_ID)])
            .then(([, cartId]) => {
                DEFAULT_TEMP_CART_ID = cartId;
                res.redirect('/puzzles');
            }).catch(err => processErr(err, res));
    })
        .catch(err => processErr(err, res));
});

app.post('/cart/:cartId([\\da-z]{24})/:action([a-z]{3,6})/:puzzleId([\\da-z]{24})', (req, res) => {
    const cartId = req.params.cartId;
    const puzzleId = req.params.puzzleId;
    Cart.getById(cartId).then(cart => {
        const action = req.params.action;
        if (action === 'add') 
            Cart.insertPuzzle(cart, puzzleId).then(() => res.redirect(`/cart/${cartId}`)).catch(err => processErr(err, res));
        else if (action === 'remove')
            Cart.removePuzzle(cart, puzzleId).then(() => res.redirect(`/cart/${cartId}`)).catch(err => processErr(err, res));

    }).catch(err => processErr(err, res));
}); 



app.use((req, res) => {
    res.status(404).render('404', { cartId: DEFAULT_TEMP_CART_ID, userId: DEFAULT_TEMP_USER_ID });
});


function processErr(err, res) {
    console.log(err);
    res.status(500).render('error', { cartId: DEFAULT_TEMP_CART_ID, userId: DEFAULT_TEMP_USER_ID });
    return false;
}

