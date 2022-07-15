const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const productAttr = ['id', 'product_name', 'price', 'stock', 'category_id']
const tagAttr = ['id', 'tag_name']
const categoryAttr = ['id', 'category_name']
// The `/api/products` endpoint

// Gets all products
router.get('/', (req, res) => {
  Product.findAll({
    attributes: productAttr,
    include: [
      {
        model: Category,
        attributes: categoryAttr
      },
      {
        model: Tag,
        attributes: tagAttr,
        through: ProductTag,
        as: 'tags'
      }
    ]
  })
  .then(dbProductData => res.json(dbProductData))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// Gets one product by its
router.get('/:id', (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id
    },
    attributes: productAttr,
    include: [
      {
        model: Category,
        attributes: categoryAttr
      },
      {
        model: Tag,
        attributes: tagAttr,
        through: ProductTag,
        as: 'tags'
      }
    ]
  })
  .then(dbProductData => {
    if (!dbProductData) {
      res.status(404).json({message: 'No product found with this id'})
    }
    res.json(dbProductData)
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
  
});

// Creates a new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Updates a product by its id
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Deletes a product by its id
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbProductData => {
    if (!dbProductData) {
      res.status(404).json({message: 'No product found with this id'})
    }
    res.json(dbProductData)
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

module.exports = router;
