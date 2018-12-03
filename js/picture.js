'use strict';
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var similarListElement = document.querySelector('.pictures');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var bigPicture = document.querySelector('.big-picture');
var socialCommentsElement = bigPicture.querySelector('.social__comments');
var socialCommentsTemplate = document.getElementById('social-comment').content.querySelector('.social__comment');
var fragment = document.createDocumentFragment();
var uploadButton = document.getElementById('upload-file');
var uploadPopup = document.querySelector('.img-upload__overlay');
var closeButtonUpload = document.getElementById('upload-cancel');
var closeButtonPhoto = bigPicture.querySelector('.big-picture__cancel');
var scaleValue = uploadPopup.querySelector('.scale__control--value');
var scaleSmaller = uploadPopup.querySelector('.scale__control--smaller');
var scaleBigger = uploadPopup.querySelector('.scale__control--bigger');
var imagePreview = uploadPopup.querySelector('.img-upload__preview');
var effectsList = uploadPopup.querySelector('.effects__list');
var effectLevel = uploadPopup.querySelector('.img-upload__effect-level');
var effectPin = uploadPopup.querySelector('.effect-level__pin');
var effectValue = uploadPopup.querySelector('.effect-level__value');
var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var descriptions = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
var names = ['Артем', 'Петр', 'Василий', 'Иван', 'Генадий', 'Виктория', 'Елена', 'Мария'];

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getImagesUrls = function (n) {
  var anyUrls = [];
  var randomUrl = 'photos/' + getRandomNumber(1, n) + '.jpg';
  while (anyUrls.length < n) {
    randomUrl = 'photos/' + getRandomNumber(1, n) + '.jpg';
    if (anyUrls.indexOf(randomUrl) === -1) {
      anyUrls.push(randomUrl);
    }
  }
  return anyUrls;
};

var imagesUrls = getImagesUrls(25);

var getRandomFromArray = function (arr) {
  return arr[getRandomNumber(0, arr.length)];
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

var getRandomPictures = function (n) {
  var randomData = [];
  for (var i = 0; i < n; i++) {
    randomData.push({
      url: imagesUrls[i],
      likes: getRandomNumber(15, 200),
      comments: getRandomComments(5),
      description: getRandomFromArray(descriptions)
    });
  }
  return randomData;
};

var renderPicture = function (picture) {
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = getRandomNumber(3, 15);

  return pictureElement;
};

var pictureData = getRandomPictures(25);

for (var i = 0; i < pictureData.length; i++) {
  fragment.appendChild(renderPicture(pictureData[i]));
}

similarListElement.appendChild(fragment);

var renderComments = function (comment) {
  var commentEllement = socialCommentsTemplate.cloneNode(true);

  commentEllement.querySelector('.social__picture').src = comment.avatar;
  commentEllement.querySelector('.social__text').textContent = comment.message;

  return commentEllement;
};

for (i = 0; i < getRandomNumber(0, 5); i++) {
  fragment.appendChild(renderComments(pictureData[i].comments[i]));
}

socialCommentsElement.appendChild(fragment);

bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');

var onUploadEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeEffect();
  }
};

var onPhotoEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePhoto();
  }
};

var openEffect = function () {
  uploadPopup.classList.remove('hidden');
  document.addEventListener('keydown', onUploadEscPress);
};

var closeEffect = function () {
  uploadPopup.classList.add('hidden');
  document.removeEventListener('keydown', onUploadEscPress);
  uploadButton.value = '';
};

var showPhoto = function (picture) {
  bigPicture.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  document.addEventListener('keydown', onPhotoEscPress);
};

var closePhoto = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onPhotoEscPress);
};

uploadButton.addEventListener('change', function () {
  openEffect();
});

closeButtonUpload.addEventListener('click', function () {
  closeEffect();
});

similarListElement.addEventListener('click', function (evt) {
  if (evt.target.className === 'picture__img') {
    showPhoto(pictureData[0]);
  }
});

closeButtonPhoto.addEventListener('click', function () {
  closePhoto();
});

var getEffect = function () {
  effectLevel.classList.remove('hidden');

  imagePreview.firstElementChild.className = '';
  imagePreview.firstElementChild.classList.add('effects__preview--' + event.target.value);

  if (event.target.value === 'none' || event.target.tagName === 'UL') {
    imagePreview.firstElementChild.style.filter = null;
    effectLevel.classList.add('hidden');
  } else if (imagePreview.firstElementChild.className === 'effects__preview--chrome') {
    imagePreview.firstElementChild.style.filter = 'grayscale(1)';
  } else if (imagePreview.firstElementChild.className === 'effects__preview--sepia') {
    imagePreview.firstElementChild.style.filter = 'sepia(1)';
  } else if (imagePreview.firstElementChild.className === 'effects__preview--marvin') {
    imagePreview.firstElementChild.style.filter = 'invert(100%)';
  } else if (imagePreview.firstElementChild.className === 'effects__preview--phobos') {
    imagePreview.firstElementChild.style.filter = 'blur(5px)';
  } else if (imagePreview.firstElementChild.className === 'effects__preview--heat') {
    imagePreview.firstElementChild.style.filter = 'brightness(3)';
  }
};

var getPinValue = function () {
  if (imagePreview.firstElementChild.className === 'effects__preview--chrome') {
    imagePreview.firstElementChild.style.filter = 'grayscale(0.' + (0.1 * effectValue.value) + ')';
  } else if (imagePreview.firstElementChild.className === 'effects__preview--sepia') {
    imagePreview.firstElementChild.style.filter = 'sepia(0.' + (0.1 * effectValue.value) + ')';
  } else if (imagePreview.firstElementChild.className === 'effects__preview--marvin') {
    imagePreview.firstElementChild.style.filter = 'invert(' + effectValue.value + '%)';
  } else if (imagePreview.firstElementChild.className === 'effects__preview--phobos') {
    imagePreview.firstElementChild.style.filter = 'blur(' + (0.05 * effectValue.value) + 'px)';
  } else if (imagePreview.firstElementChild.className === 'effects__preview--heat') {
    imagePreview.firstElementChild.style.filter = 'brightness(' + (0.03 * effectValue.value) + ')';
  }
};

scaleBigger.addEventListener('click', function () {
  if (scaleValue.value === '25%') {
    scaleValue.value = '50%';
    imagePreview.firstElementChild.style = 'transform: scale(0.5)';
  } else if (scaleValue.value === '50%') {
    scaleValue.value = '75%';
    imagePreview.firstElementChild.style = 'transform: scale(0.75)';
  } else if (scaleValue.value === '75%') {
    scaleValue.value = '100%';
    imagePreview.firstElementChild.style = 'transform: scale(1.0)';
  }
});

scaleSmaller.addEventListener('click', function () {
  if (scaleValue.value === '100%') {
    scaleValue.value = '75%';
    imagePreview.firstElementChild.style = 'transform: scale(0.75)';
  } else if (scaleValue.value === '75%') {
    scaleValue.value = '50%';
    imagePreview.firstElementChild.style = 'transform: scale(0.5)';
  } else if (scaleValue.value === '50%') {
    scaleValue.value = '25%';
    imagePreview.firstElementChild.style = 'transform: scale(0.25)';
  }
});

effectsList.addEventListener('click', function () {
  getEffect();
});

effectsList.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    getEffect();
  }
});

effectPin.addEventListener('mouseup', function () {
  getPinValue();
});

effectPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    getPinValue();
  }
});

