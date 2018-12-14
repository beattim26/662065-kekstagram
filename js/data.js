'use strict';
(function () {
  var descriptions = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];

  var getImagesUrls = function (n) {
    var anyUrls = [];
    var randomUrl = 'photos/' + window.util.getRandomNumber(1, n) + '.jpg';
    while (anyUrls.length < n) {
      randomUrl = 'photos/' + window.util.getRandomNumber(1, n) + '.jpg';
      if (anyUrls.indexOf(randomUrl) === -1) {
        anyUrls.push(randomUrl);
      }
    }
    return anyUrls;
  };

  var imagesUrls = getImagesUrls(25);

  var getRandomPictures = function (n) {
    var randomData = [];
    for (var i = 0; i < n; i++) {
      randomData.push({
        url: imagesUrls[i],
        likes: window.util.getRandomNumber(15, 200),
        comments: window.util.getRandomComments(window.util.getRandomNumber(0, 5)),
        description: window.util.getRandomFromArray(descriptions)
      });
    }
    return randomData;
  };

  window.data = {
    getRandomPictures: getRandomPictures
  };
})();
