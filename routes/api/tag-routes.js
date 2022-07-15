const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const productAttr = ['id', 'product_name', 'price', 'stock', 'category_id']
const tagAttr = ['id', 'tag_name']

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll({
    attributes: tagAttr,
    include: [
      {
        model: Product,
        attributes: productAttr,
        through: ProductTag,
        as: 'tagged_products'
      }
    ]
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    console.log(err)
    res.status(500).json(err);
  })
});

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: tagAttr,
    include: [
      {
        model: Product,
        attributes: productAttr,
        through: ProductTag,
        as: 'tagged_products'
      }
    ]
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({message: 'No tag found with this id'})
    }
    res.json(dbTagData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err);
  })
});

router.post('/', (req, res) => {
  Tag.create(req.body)
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    console.log(err)
    res.status(500).json(err);
  })
});

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where : {
      id : req.params.id
    }
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({message: 'No tag found with this id'})
    }
    res.json(dbTagData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err);
  })
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where : {
      id : req.params.id
    }
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({message: 'No tag found with this id'})
    }
    res.json(dbTagData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err);
  })
});

module.exports = router;
