'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var getRandomFromArray = function (arr) {
    return arr[getRandomNumber(0, arr.length - 1)];
  };


  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomFromArray: getRandomFromArray,
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE
  };
})();
