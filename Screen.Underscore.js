﻿//-----------------------------------------------------------------------------
// Filename : Screen.Underscore.js
//-----------------------------------------------------------------------------
// Language : Javascript
// Date of creation : 25.11.2017
// Require: Screen.js
//-----------------------------------------------------------------------------
// Utility functions for Screens
//-----------------------------------------------------------------------------

Class.Mixin(Screen, {

	initialize: function() {

		/**
		 en: This property contains unique ids for the uniqueId() method
		 ru: Свойство хранящее счётчики уникальных индентификаторов для метода uniqueId()

		 @private
		 @property uniqueIds
		 @for Screen
		 */
		this.uniqueIds = {};

	},

	/**
	 en: Change the context of given function to current screen instance
	 ru: Изменяет контекст переданной функции на текущий экземпляр Screen

	 	this.bind(function() {

	 		en://'this' here will reference to {{#crossLink "Screen"}}{{/crossLink}} instance
	 		ru://'this' здесь будет ссылаться на текущий экземпляр {{#crossLink "Screen"}}{{/crossLink}}

	 	});

	 @method bind
	 @param fn {Function}
	 @return {Function}
	 en: New function with changed context
	 ru: Новая функция с изменённым контекстом
	 @for Screen
	 */
	bind: function(fn) {

		var _this = this;

		return function() {

			fn.apply(_this, arguments);

		};

	},

	/**
	 en: Call the given function delayed and change the context of given function to current screen instance.
	 en: This function will be called through 1 second:
	 ru: Запускает функцию через указанное количество миллисекунд и изменяет контекст переданной функции на текущий экземпляр Screen.
	 ru: Эта функция вызовется через 1 секунду:

	 	this.timeout(function() {

	 		en://'this' here will reference to {{#crossLink "Screen"}}{{/crossLink}} instance
	 		ru://'this' здесь будет ссылаться на текущий экземпляр {{#crossLink "Screen"}}{{/crossLink}}

	 	}, 1000);

	 @method timeout
	 @param fn {Function}
	  en: Function to call
	  ru: Функция для вызова
	 @param time {Number}
	  en: Time in milliseconds
	  ru: Время в миллисекундах
	 @return {Timeout}
	  en: Timeout id
	  ru: Таймаут идентификатор
	 @for Screen
	 */
	timeout: function(fn, time) {

		return setTimeout(this.bind(fn), time);

	},

	/**
	 en: Call the given function for each array or object item and change it's context to current screen instance.
	 en: This function will be called 3 times, ones for each array item:
	 ru: Запускает функцию для каждого значения массива или объекта и изменяет контекст вызываемой функции.
	 ru: Эта функция вызовется 3 раза, по одному разу для каждого значения массива:

	 	const arr = [1, null, 6];

	 	this.each(arr, function(value, index) {

	 		en://'this' here will reference to {{#crossLink "Screen"}}{{/crossLink}} instance by default
	 		ru://'this' здесь будет ссылаться по-умолчанию на текущий экземпляр {{#crossLink "Screen"}}{{/crossLink}}

	 	});

	 @method each
	 @param obj {Array|Object}
	 en: Array or object for iterate
	 ru: Массив или объект для перебора
	 @param fn {Function}
	 en: Function to call
	 ru: Функция для вызова
	 @param [context=Screen] {Number}
	 en: Context object for the function (be default current {{#crossLink "Screen"}}{{/crossLink}} reference)
	 ru: Контекст для функции (по-умолчанию текущий объект {{#crossLink "Screen"}}{{/crossLink}})
	 @for Screen
	 */
	each: function(obj, fn, context) {

		if (!obj) return;

		var i;

		if (this.isArray(obj)) {

			for (i = 0; i < obj.length; i++) {

				fn.call(context || this, obj[i], i);

			}

		} else {

			for (i in obj) if (obj.hasOwnProperty(i)) {

				fn.call(context || this, obj[i], i);

			}

		}

	},

	/**
	 en: Returns true if value exist in array, otherwise false. Used type-based comparison.
	 ru: Возвращает true если значение присутствует в массиве, иначе false. Используется строготипизированное сравнение.

	 	const arr = [1, null, 6];

	 	if (this.contains(arr, 6)) {

	 		en://This code will be called, because array contains value 6
	 		ru://Этот код выполнится так как массив содержит число 6

	 	}

	 @method contains
	 @param array {Array}
	 en: Array or search
	 ru: Массив для поиска
	 @param obj {Mixed}
	  en: Value for the type-sensitive search
	  ru: Значение для строготипизированного поиска
	 @return {Boolean}
	 en: true if value exist in array, otherwise false
	 ru: true если значение присутствует в массиве, иначе false
	 @for Screen
	 */
	contains: function(array, obj) {

		if (!array) return false;

		var i = array.length;

		while (i--) {

			if (array[i] === obj) {

				return true;

			}

		}

		return false;

	},

	/**
	 en: Returns array with values from first array except values from second array
	 ru: Возвращает новый массив содержащий значения из первого массива исключая значения из второго массива

	 	const arr1 = [1, 2, 5, 6];
	 	const arr2 = [2, '6'];

	 	let arr = this.difference(arr1, arr2);

	 	en://arr will be [1, 5, 6]
	 	ru://arr будет [1, 5, 6]

	 @method difference
	 @param array {Array}
	 en: Array for filter
	 ru: Массив для фильтрации
	 @param exclude {Array}
	 en: Values for filter
	 ru: Значения которые нужно убрать
	 @return {Array}
	 en: New array with values from first array, except values from second array
	 ru: Новый массив содержащий значения из первого массива, исключая значения из второго массива
	 @for Screen
	 */
	difference: function(array, exclude) {

		return this.filter(array, function(value) {

			return !this.contains(exclude, value);

		});

	},

	/**
	 en: Returns array with values from given array except specified values
	 ru: Возвращает новый массив содержащий значения из первого массива исключая указанные значения

	 	let arr = [1, 2, 5, 6];

	 	arr = this.without(arr, 2, 6);

	 	en://arr will be [1, 5]
	 	ru://arr будет [1, 5]

	 @method without
	 @param array {Array}
	 en: Array for filter
	 ru: Массив для фильтрации
	 @param [value...]
	 en: Values for filter
	 ru: Значения которые нужно убрать
	 @return {Array}
	 en: New array with values from first array, except specified values
	 ru: Новый массив содержащий значения из первого массива исключая указанные значения
	 @for Screen
	 */
	without: function(array) {

		return this.difference(arguments[0], Array.prototype.slice.call(arguments).slice(1));

	},

	/**
	 en: Transform given array of objects to object
	 ru: Преобразовывает массив объектов в хэш по указанному ключу

	 	const arr = [{name: 'a', value: 1}, {name: 'b', value: 2}, {name: 'c', value: 3}];

	 	const obj = this.indexBy(arr, 'name');

	 	en://obj will be {'a': {name: 'a', value: 1}, 'b': {name: 'b', value: 2}, 'c': {name: 'c', value: 3}}
	 	ru://obj будет {'a': {name: 'a', value: 1}, 'b': {name: 'b', value: 2}, 'c': {name: 'c', value: 3}}

	 @method indexBy
	 @param array {Array}
	 en: Array of objects to transform
	 ru: Массив объектов для преобразования
	 @param key {String}
	 en: Key inside array objects, values of which will be keys for the new object
	 ru: Ключ объектов внутри массива, значения которого станут ключами для нового объекта
	 @return {Object}
	 en: New object
	 ru: Новый объект
	 @for Screen
	 */
	indexBy: function(array, key) {

		var result = {};

		this.each(array, function(value) {

			result[value[key]] = value;

		});

		return result;

	},

	/**
	 en: Checks if given value is object
	 ru: Проверяет, является ли переданное значение объектом

	 	var a = {};

	 	if (this.isObject(a)) {

	 		en://This code will be called, because 'a' is object
	 		ru://Этот код выполнится так как 'a' является объектом

	 	}

	 @method isObject
	 @param obj
	 en: Any value for the check
	 ru: Любое значение для проверки
	 @return {Boolean}
	 en: true if given value is object, otherwise false
	 ru: true если переданное значение является объектом, иначе false
	 @for Screen
	 */
	isObject: function(obj) {

		return typeof obj === 'object' && obj !== null && !(obj instanceof Array);

	},

	/**
	 en: Checks if given value is array
	 ru: Проверяет, является ли переданное значение массивом

	 	const a = [];

	 	if (this.isArray(a)) {

	 		en://This code will be called, because 'a' is object
	  		ru://Этот код выполнится так как 'a' является объектом

	 	}

	 @method isArray
	 @param obj
	 en: Any value for the check
	 ru: Любое значение для проверки
	 @return {Boolean}
	 en: true if given value is array, otherwise false
	 ru: true если переданное значение является массивом, иначе false
	 @for Screen
	 */
	isArray: function(obj) {

		return obj instanceof Array;

	},

	/**
	 en: Copy and override all properties from second object to first, and returns first object
	 ru: Копирует и перезаписывает все свойства второго объекта в первый объект и возвращает первый объект

	 	const o1 = {'c': 12, 'e': 14};
	 	const o2 = {'c': 5, 'd': 8};

	 	this.extend(o1, o2);

	 	en://o1 will be {'c': 5, 'e: 14, 'd': 8}
	 	ru://o1 будет {'c': 5, 'e: 14, 'd': 8}

	 @method extend
	 @param obj1 {Object}
	 en: Object
	 ru: Объект
	 @param obj2 {Object}
	 en: Object
	 ru: Объект
	 @return {Object}
	 en: obj1 with properties from obj2
	 ru: obj1 со свойствами obj2
	 @for Screen
	 */
	extend: function(obj1, obj2) {

		this.each(obj2, function(value, key) {

			obj1[key] = value;

		});

		return obj1;

	},

	merge: function(out) {

		out = out || {};

		for (var i = 1, len = arguments.length; i < len; ++i) {

			var obj = arguments[i];

			if (!obj) {
				continue;
			}

			for (var key in obj) {

				if (!obj.hasOwnProperty(key)) {
					continue;
				}

				if (this.isObject(obj[key])) {
					out[key] = this.merge(out[key], obj[key]);
					continue;
				}

				out[key] = obj[key];

			}

		}

		return out;

	},

	filter: function(array, fn) {

		var result = [];

		this.each(array, function(value, key) {

			if (fn.call(this, value, key)) result.push(value);

		});

		return result;

	},

	sample: function(array) {

		if (!array) return null;

		if (!this.isArray(array)) array = this.values(array);

		return array[Math.floor(Math.random() * array.length)];

	},

	pluck: function(obj, key) {

		var result = [];

		this.each(obj, function(value) {

			result.push(value[key]);

		});

		return result;

	},

	shuffle: function(array) {

		array = array.concat([]);

		var j, x, i;

		for (i = array.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = array[i];
			array[i] = array[j];
			array[j] = x;
		}

	},

	random: function(min, max) {

		return Math.floor(Math.random() * (max - min + 1)) + min;

	},

	isEqual: function(arr1, arr2) {

		var result = arr1 && arr2 && arr1.length === arr2.length;

		if (!result) return false;

		for (var i = arr1.length - 1; i >= 0; i--) {

			if (arr1[i] !== arr2[i]) result = false;

		}

		return result;

	},

	values: function(obj) {

		var result = [];

		this.each(obj, function(value) {

			result.push(value);

		});

		return result;

	},

	uniqueId: function(name) {

		if (!this.uniqueIds[name]) this.uniqueIds[name] = 0;

		return (name || '') + this.uniqueIds[name]++;

	}

}); 
