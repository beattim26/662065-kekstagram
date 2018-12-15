'use strict';
(function (util) {
  var STEP_VALUE = 25;
  var MAX_VALUE = '100%';
  var MIN_VALUE = '25%';
  var MAX_SHIFT_X = 450;
  var PERCENT_PIN_POSITION = 4.5;
  var activeFilter;
  var effectLevel = document.querySelector('.img-upload__effect-level');
  var imagePreview = document.querySelector('.img-upload__preview-photo');
  var scaleValue = document.querySelector('.scale__control--value');
  var scaleSmaller = document.querySelector('.scale__control--smaller');
  var scaleBigger = document.querySelector('.scale__control--bigger');
  var effectsList = document.querySelector('.img-upload__effects');
  var effectValue = effectLevel.querySelector('.effect-level__value');
  var effectPin = effectLevel.querySelector('.effect-level__pin');
  var effectDepth = effectLevel.querySelector('.effect-level__depth');
  var effectsLabel = effectValue.querySelectorAll('.effects__label');
  var Filter = {
    NONE: 'none',
    CHROME: 'chrome',
    SEPIA: 'sepia',
    MARVIN: 'marvin',
    PHOBOS: 'phobos',
    HEAT: 'heat'
  };

  var changeFilter = function (filterName) {
    var effectsValue = 'effects__preview--' + filterName;
    effectLevel.classList.remove('hidden');

    imagePreview.className = '';
    imagePreview.classList.add(effectsValue);
    imagePreview.style.filter = null;

    if (filterName === Filter.NONE) {
      effectLevel.classList.add('hidden');
      activeFilter = Filter.NONE;
    } else {
      activeFilter = filterName;
    }
  };

  var getFilterStyle = function (name, value) {
    switch (name) {
      case Filter.CHROME:
        return 'grayscale(' + (0.01 * value) + ')';
      case Filter.SEPIA:
        return 'sepia(' + (0.01 * value) + ')';
      case Filter.MARVIN:
        return 'invert(' + value + '%)';
      case Filter.PHOBOS:
        return 'blur(' + (0.05 * value) + 'px)';
      case Filter.HEAT:
        return 'brightness(' + (0.03 * value) + ')';
      default:
        return value;
    }
  };

  var applyFilter = function () {
    imagePreview.style.filter = getFilterStyle(activeFilter, effectValue.value);
  };

  scaleBigger.addEventListener('click', function () {
    if (scaleValue.value !== MAX_VALUE) {
      var currentValue = parseInt(scaleValue.value, 10);
      scaleValue.value = currentValue + STEP_VALUE + '%';
      currentValue += STEP_VALUE;
      imagePreview.style.transform = 'scale(' + currentValue / 100 + ')';
    }
  });

  scaleSmaller.addEventListener('click', function () {
    if (scaleValue.value !== MIN_VALUE) {
      var currentValue = parseInt(scaleValue.value, 10);
      scaleValue.value = currentValue - STEP_VALUE + '%';
      currentValue -= STEP_VALUE;
      imagePreview.style.transform = 'scale(' + currentValue / 100 + ')';
    }
  });

  effectsList.addEventListener('change', function (evt) {
    changeFilter(evt.target.value);
  });

  for (var i = 0; i < effectsLabel.length; i++) {
    effectsLabel[i].addEventListener('keydown', function (evt) {
      if (evt.keyCode === util.ENTER_KEYCODE) {
        var eventInput = document.getElementById(event.target.parentNode.htmlFor);
        changeFilter(eventInput.value);
      }
    });
  }

  effectPin.addEventListener('mouseup', function () {
    applyFilter();
  });

  effectPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === util.ENTER_KEYCODE) {
      applyFilter();
    }
  });

  effectPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      var positionPin = effectPin.offsetLeft - shift.x;

      if (positionPin >= 0 && positionPin <= MAX_SHIFT_X) {
        effectPin.style.left = positionPin + 'px';
        effectDepth.style.width = (effectPin.offsetLeft / PERCENT_PIN_POSITION) + '%';
        effectValue.value = effectPin.offsetLeft / PERCENT_PIN_POSITION;
      }

      applyFilter();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  effectsList.addEventListener('change', function (evt) {
    changeFilter(evt.target.value);
    effectPin.style.left = MAX_SHIFT_X + 'px';
    effectDepth.style.width = '100%';
  });

  effectPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === util.ENTER_KEYCODE) {
      applyFilter();
    }
  });
})(window.util);
