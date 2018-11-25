'use strict';
var similarListElement = document.querySelector('.pictures');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var bigPicture = document.querySelector('.big-picture');
var fragment = document.createDocumentFragment();
var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var description = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomProperty = function (arr) {
  return arr[getRandomNumber(0, arr.length)];
};

var getRandomData = function (n) {
  var randomData = [];
  for (var i = 0; i < n; i++) {
    randomData.push({
      url: 'photos/' + getRandomNumber(1, 25) + '.jpg',
      likes: getRandomNumber(15, 200),
      comments: getRandomProperty(comments),
      description: getRandomProperty(description)
    });
  }

  return randomData;

};

var getRandomPicture = function (picture) {
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = getRandomNumber(3, 15);

  return pictureElement;
};

var pictureData = getRandomData(25);

for (var i = 0; i < pictureData.length; i++) {
  fragment.appendChild(getRandomPicture(pictureData[i]));
}

similarListElement.appendChild(fragment);

var getPropertyPicture = function (picture) {
  var propertyElement = bigPicture.cloneNode(true);
  var commentAvatar = bigPicture.querySelectorAll('.social__picture');
  var commentText = bigPicture.querySelectorAll('.social__text');

  bigPicture.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  for (i = 0; i < commentAvatar.length; i++) {
    commentAvatar[i].src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
  }

  for (i = 0; i < commentText.length; i++) {
    commentText[i].textContent = pictureData[i].comments;
  }

  return propertyElement;
};

fragment.appendChild(getPropertyPicture(pictureData[0]));
bigPicture.appendChild(fragment);

bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
