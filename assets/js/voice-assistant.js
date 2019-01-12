/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/voice-assistant.js":
/*!*************************************!*\
  !*** ./src/core/voice-assistant.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _voice_synthesizer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./voice-synthesizer */ \"./src/core/voice-synthesizer.js\");\n/* harmony import */ var _voice_recognizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./voice-recognizer */ \"./src/core/voice-recognizer.js\");\n\n\n\nclass VoiceAssistant {\n\n  static isSupported() {\n    return _voice_synthesizer__WEBPACK_IMPORTED_MODULE_0__[\"default\"].isSupported() && _voice_recognizer__WEBPACK_IMPORTED_MODULE_1__[\"default\"].isSupported();\n  }\n\n  constructor(config) {\n    this._mainCommand = config.mainCommand.toLowerCase().trim();\n    this._voiceSynthesizer = new _voice_synthesizer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](config.lang, config.volume, config.speed);\n    this._voiceRecognizer = new _voice_recognizer__WEBPACK_IMPORTED_MODULE_1__[\"default\"](config.lang, config.grammar);\n    this.callbackListeners = [];\n    this.isRecognizerListening = false;\n  }\n\n  listen(actions, callback) {\n    this.callbackListeners.push({\n      callback: callback,\n      actions: actions.map(action =>\n        action.trim().toLowerCase().replace(/[^a-zA-Z\\s]/g, '')\n      )\n    });\n\n    if (!this.isRecognizerListening) {\n      this.isRecognizerListening = true;\n      this._voiceRecognizer.listen(speech => {\n        const speechText = speech.text.toLowerCase().trim();\n        const isStartCommand = speechText === this._mainCommand;\n\n        console.log(speechText);\n\n        if (!isStartCommand) {\n          for (let i = 0; i < this.callbackListeners.length; i++) {\n            let match = false;\n            const listener = this.callbackListeners[i];\n            for (let j = 0; j < listener.actions.length; j++) {\n              const action = listener.actions[j];\n              if (speechText.includes(action)) {\n                listener.callback();\n                match = true;\n                break;\n              }\n            }\n            if (match) break;\n          }\n        }\n      });\n    }\n  }\n\n  say(speech, callback = () => {}) {\n    this._voiceRecognizer.pause();\n    this._voiceSynthesizer.say(speech).then(() => {\n      this._voiceRecognizer.resume();\n      if (typeof callback === 'function') {\n        setTimeout(callback, 200);\n      }\n    });\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (VoiceAssistant);\n\n\n//# sourceURL=webpack:///./src/core/voice-assistant.js?");

/***/ }),

/***/ "./src/core/voice-recognizer.js":
/*!**************************************!*\
  !*** ./src/core/voice-recognizer.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass VoiceRecognizer {\n\n  constructor(lang, phrases) {\n    const grammar = '#JSGF V1.0; grammar phrases; public <phrases> = ' + phrases.join(' | ') + ';';\n    this.recognition = new (VoiceRecognizer._instance())();\n\n    const speechRecognitionList = new (VoiceRecognizer._grammar())();\n    speechRecognitionList.addFromString(grammar, 1);\n    this.recognition.grammars = speechRecognitionList;\n\n    this.recognition.continuous = true;\n    this.recognition.interimResults = false;\n    this.recognition.maxAlternatives = 1;\n    this.recognition.lang = lang;\n    this.isStarted = false;\n\n    this.speechCallbacks = [];\n\n    this.recognition.onstart = () => {\n      this.isStarted = true;\n      console.log('DEBUG: Recognition start...');\n    };\n\n    this.recognition.onend = () => {\n      this.isStarted = false;\n      console.log('DEBUG: Recognition end!');\n      if (!this.isPaused) {\n        this.recognition.start();\n      }\n    };\n\n    this.recognition.onresult = event => {\n      let speech = event.results[event.resultIndex][0];\n      this.speechCallbacks.forEach(callback => callback({\n        text: speech.transcript.trim().toLowerCase(),\n        confidence: speech.confidence\n      }));\n    }\n\n    this.recognition.start();\n  }\n\n  listen(callback) {\n    this.speechCallbacks.push(callback);\n  }\n\n  pause() {\n    this.isPaused = true;\n    this.recognition.stop();\n  }\n\n  resume() {\n    this.isPaused = false;\n    if (!this.isStarted) {\n      this.recognition.start();\n    }\n  }\n\n  static isSupported() {\n    return Boolean(VoiceRecognizer._instance()) && Boolean(VoiceRecognizer._grammar());\n  }\n\n  static _instance() {\n    return window.SpeechRecognition\n      || window.webkitSpeechRecognition\n      || window.mozSpeechRecognition\n      || window.msSpeechRecognition;\n  }\n\n  static _grammar() {\n    return window.SpeechGrammarList || window.webkitSpeechGrammarList;\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (VoiceRecognizer);\n\n\n//# sourceURL=webpack:///./src/core/voice-recognizer.js?");

/***/ }),

/***/ "./src/core/voice-synthesizer.js":
/*!***************************************!*\
  !*** ./src/core/voice-synthesizer.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass VoiceSynthesizer {\n\n  constructor(lang, volume, speed) {\n    window.utterances = [];\n    this.lang = lang;\n    this.volume = volume;\n    this.speed = speed;\n    this.voices = window.speechSynthesis.getVoices();\n    this.voicesLoaded = false;\n\n    window.speechSynthesis.onvoiceschanged = () => {\n      this.voices = window.speechSynthesis.getVoices();\n      let voiceId = 0;\n\n      this.voices.forEach((voice, index) => {\n        if (voice.lang === this.lang) {\n          voiceId = index;\n        }\n      });\n\n      this.utterance = new window.SpeechSynthesisUtterance;\n      this.utterance.voice = this.voices[voiceId];\n      this.utterance.voiceURI = 'native';\n      this.utterance.volume = this.volume;\n      this.utterance.lang = this.lang;\n      this.utterance.rate = this.speed;\n\n      if (this.voices.length > 0 && !this.voicesLoaded) {\n        this.voicesLoaded = true;\n      }\n    };\n  }\n\n  say(text) {\n    return new Promise((resolve, reject) => {\n      if (!text || !text.trim()) {\n        resolve();\n        return;\n      }\n      window.speechSynthesis.cancel();\n      this.utterance.text = text;\n      window.utterances.push(this.utterance);  // work around to BUG in utterances.\n\n      this.utterance.onend = () => {\n        resolve();\n      };\n\n      window.speechSynthesis.speak(this.utterance);\n    });\n  }\n\n  static isSupported() {\n    return 'speechSynthesis' in window;\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (VoiceSynthesizer);\n\n\n//# sourceURL=webpack:///./src/core/voice-synthesizer.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _core_voice_assistant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/voice-assistant */ \"./src/core/voice-assistant.js\");\n\n\nwindow.addEventListener('load', event => {\n  if (!_core_voice_assistant__WEBPACK_IMPORTED_MODULE_0__[\"default\"].isSupported()) {\n    console.log('Your browser do not supports voice assistant :(');\n    return;\n  }\n\n  const config = {\n    lang: 'en-US',\n    volume: 1,\n    speed: 1,\n    mainCommand: 'show',\n    soundEffect: '/assets/audio/beep.wav',\n    grammar: [\n      'How are you',\n      'How are you doing',\n      'Are you a robot',\n      'Do you love me'\n    ]\n  };\n\n  const assistant = new _core_voice_assistant__WEBPACK_IMPORTED_MODULE_0__[\"default\"](config);\n\n  assistant.listen(['Hello'], () => {\n    assistant.say('Hi, I am your voice assistant, let\\'s talk?');\n  });\n\n  assistant.listen(['How are you?', 'How are you doing?'], () => {\n    assistant.say('I am pretty good, thanks!', () => {\n      assistant.say('How about you?');\n    });\n  });\n\n  assistant.listen(['Are you a robot?'], () => {\n    assistant.say('Course not, I am a human, trust-me!');\n  });\n\n  assistant.listen(['Do you love me?'], () => {\n    assistant.say('Oh, come on, seriously?');\n  });\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });