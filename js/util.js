'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var names = ['Артем', 'Петр', 'Василий', 'Иван', 'Генадий', 'Виктория', 'Елена', 'Мария'];

  var getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var getRandomFromArray = function (arr) {
    return arr[getRandomNumber(0, arr.length - 1)];
  };

  var getRandomMessage = function (n) {
    if (n === 1) {
      return getRandomFromArray(comments);
    }
    return getRandomFromArray(comments) + ' ' + getRandomFromArray(comments);
  };

  var getRandomComments = function (n) {
    var randomComments = [];
    for (var i = 0; i < n; i++) {
      randomComments.push({
        avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
        message: getRandomMessage(getRandomNumber(1, 2)),
        name: getRandomFromArray(names)
      });
    }
    return randomComments;
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomFromArray: getRandomFromArray,
    getRandomComments: getRandomComments,
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE
  };
})();
