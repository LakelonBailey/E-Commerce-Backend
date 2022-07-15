const router = require('express').Router();
const { Category, Product } = require('../../models');
const productAttr = ['id', 'product_name', 'price', 'stock', 'category_id']
const categoryAttr = ['id', 'category_name']

// The `/api/categories` endpoint

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

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
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

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.put('/:id', (req, res) => {
  Category.update(
    {
      category_name: req.params.category_name
    },
    {
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
