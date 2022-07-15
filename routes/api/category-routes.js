const router = require('express').Router();
const { Category, Product } = require('../../models');
const productAttr = ['id', 'product_name', 'price', 'stock', 'category_id']
const categoryAttr = ['id', 'category_name']

// The `/api/categories` endpoint


// Gets all categories
router.get('/', (req, res) => {
  Category.findAll({
    attributes: categoryAttr,
    include: [{
      model: Product,
      attributes: productAttr
    }]
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    console.log(err)
    res.status(500).json(err);
  })

});


// Gets one category by its id
router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    attributes: categoryAttr,
    include: [{
      model: Product,
      attributes: productAttr
    }]
  })
  .then(dbCategoryData => {
    if (!dbCategoryData) {
      res.status(404).json({message: 'No category found with this id'})
    }
    res.json(dbCategoryData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err);
  })
});


// Creates a new category
router.post('/', (req, res) => {
  Category.create(req.body)
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});


// Updates a category by its id
router.put('/:id', (req, res) => {
  Category.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'No category found with this id'})
      }
      res.json(dbCategoryData)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err);
    })
});


// Deletes a category by its id
router.delete('/:id', (req, res) => {
  Category.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'No category found with this id'})
      }
      res.json(dbCategoryData)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err);
    })
});

module.exports = router;
