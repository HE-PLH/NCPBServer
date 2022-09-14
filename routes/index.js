var express = require('express');
var router = express.Router();
/*
  This is our backend server.
  Replace YOUR_IMAGEKIT_URL_ENDPOINT, YOUR_IMAGEKIT_PUBLIC_KEY,
  and YOUR_IMAGEKIT_PRIVATE_KEY with actual values
*/
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/patricode',
  publicKey: 'public_ORd+K5aX8s27TkeubRrTJoLkEPE=',
  privateKey: 'private_Nd9yIzksVJ0vObbL5xMzlAX/A5w='
});
router.get('/auth', function (req, res) {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
});



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
