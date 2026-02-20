function add(req, res) {
  res.status(200).json('add book to cart');
}

function display(req, res) {
  res.status(200).json('display books in cart');
}

function remove(req, res) {
  res.status(200).json('remove book from cart');
}

module.exports = {
  add,
  display,
  remove
};
