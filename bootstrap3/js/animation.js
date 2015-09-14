

Animation.animate(function () {
  registerCanvas('drawing');
  var sf = registerSVG('drawing', '${image_path}/population-test-sf.svg', 403, 98, 210, 17);
  var burbank = registerSVG('drawing', '${image_path}/population-test-burbank.svg', 403, 98, 630,17);
  addAnimation('drawing', function() {
    sf.image.animate(1000, '<>', 100).move(630, 17);
    burbank.image.animate(1000, '<>', 100).move(210, 17);
  });
  addAnimation('drawing', function() {
    sf.image.animate(1000, '<>', 100).move(630, 217);
  });
  addAnimation('drawing', function() {
    burbank.image.animate(1000, '<>', 100).move(210, 317);
  });
});
