function add(req, res) {
  res.status(200).json({message: 'Create a new category'});
}

function display(req, res) {
  res.status(200).json({message: 'Display categories'});
}

function remove(req, res) {
  res.status(200).json({message: 'Delete a category'});
}

function update(req, res) {
  res.status(200).json({message: 'Update a category'});
}

module.exports = {
  add,
  display,
  update,
  remove
};
