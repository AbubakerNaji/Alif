const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const {setFilter} = require('../controllers/handlerFactory');
const {protected} = require('../utils/middleware/protected');
const router = express.Router();

router.get('/' ,protected,setFilter, favoriteController.getMyFavoritesPopulate);
router.post('/',protected, favoriteController.AddFavorite);
router.delete('/:id',protected, favoriteController.deleteFavorite);
router.put('/:id',protected, favoriteController.updateFavorite);

module.exports = router