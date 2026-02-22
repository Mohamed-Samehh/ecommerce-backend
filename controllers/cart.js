const {Cart, Book} = require('../models');

// TODO: Joi
async function add(req, res, next) { // Post /cart (logged in user)
  const {_id} = req.user; // get user from token
  const {bookId, quantity} = req.body;
  try {
    const myBook = await Book.findById(bookId); // check book exists in DB
    if (!myBook)
      return res.status(404).send({status: 'fail', message: 'Book not found'});

    if (myBook.stock < quantity) // check stock
      return res.status(400).send({status: 'fail', message: 'Not enough stock'});

    const myCart = await Cart.findOneAndUpdate({user: _id}, {}, {upsert: true, new: true}); // find user's cart or create new one
    const bookInCart = myCart.items.find((item) => bookId === item.book.toString()); // check if book already in cart

    if (!bookInCart) {
      myCart.items.push({book: bookId, quantity});
    } else {
      bookInCart.quantity += quantity;
    }
    await myCart.save();

    res.status(200).send({status: 'success', data: myCart});
  } catch (error) {
    next(error);
  }
}

async function display(req, res, next) { // Get /cart (logged in user)
  const {_id} = req.user;
  try {
    const userBooks = await Cart.findOne({user: _id}).populate('items.book'); // search by user ref. & use populate to show book details for frontend
    if (!userBooks) return res.status(200).send({status: 'success', data: {items: []}});

    res.status(200).send({status: 'success', data: userBooks}); // items array contain each book details and quantity
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) { // Delete /cart/:bookId (logged in user)
  const {_id} = req.user;
  const {bookId} = req.params;

  try {
    const myCart = await Cart.findOne({user: _id});
    if (!myCart) {
      return res.status(404).send({status: 'fail', message: 'Cart not found'});
    }

    const bookIndex = myCart.items.findIndex((item) => item.book.toString() === bookId); // We find the position of the book in the items array

    if (bookIndex === -1) {
      return res.status(404).send({status: 'fail', message: 'Book not found in cart'});
    }

    myCart.items.splice(bookIndex, 1); // pull book from items array

    await myCart.save();
    res.status(200).send({status: 'success', data: myCart});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  add,
  display,
  remove
};
