/**
 * Voice api wrapper.
 *
 * @class
 */
class Assistant {

  constructor(recognition, synthesizer, pageReader, startCommand, soundEffect, actions, stopWords, debug = false) {
    this._recognition = recognition;
    this._synthesizer = synthesizer;
    this._pageReader = pageReader;
    this._startCommand = startCommand;
    this._soundEffect = new Audio(soundEffect);
    this._actions = actions;
    this._stopWords = stopWords;
    this._debug = debug;
    this._waitingNextSpeech = false;
  }

  /**
   * Listen to user's command.
   * @param {function} Callback to user's speech recognition.
   */
  listen(callback) {
    this._recognition.listen((speech) => {
      const speechText = speech.text.toLowerCase().trim();
      const startCommand = this._startCommand.toLowerCase().trim();
      const isStartCommand = speechText === startCommand;

      if (this._debug) console.log('DEBUG: ', speech.text);

      if (isStartCommand) {
        this._soundEffect.play();
      }

      if (this._waitingNextSpeech) {
        this._waitingNextSpeech = false;
        this._extractAction(speech);
        this._extractKeyword(speech);
        callback(speech);
      }

      this._waitingNextSpeech = isStartCommand;
    });
  }

  /**
   * Listen to user's command.
   * @param {string} speech - The text to speak.
   * @param {function} Callback to call when Synthesizer finish.
   */
  say(speech, callback = () => {}) {
    this._synthesizer.say(speech).then(() => {
      if (typeof callback === 'function') {
        //window.utterances = []; // work around to BUG in utterances.
        callback();
      }
    });
  }

  /**
   * Describe what's in the page.
   * @param {function} Callback to call when Page Reader finish.
   */
  describePage(callback = () => {}) {
    const _this = this;
    const chunkLength = 120;

    this._pageReader.analyze().then((pageDescription) => {
      if (pageDescription.length < chunkLength) {
        _this.say(pageDescription, () => {
          callback();
        });
      } else {
        const sentences = pageDescription.split(/[\\.!\?]/);
        let speechCallbacks = [];
        speechCallbacks.length = sentences.length;

        sentences.map((speech, i) => {
          if (i === speechCallbacks.length - 1) {
            if (typeof callback === 'function') {
              speechCallbacks[i] = () => {
                _this.say(speech, () => {
                  callback();
                });
              };
            }
          } else {
            speechCallbacks[i] = () => {
              _this.say(speech, speechCallbacks[i+1]);
            };
          }
        });
        speechCallbacks[0]();
      }
    });
  }

  _extractKeyword(speech) {
    const keywords = speech.text.split(' ');
    const blackList = [];

    for (let i = 0; keywords.length > i; i++) {
      if (this._stopWords.indexOf(keywords[i]) !== -1 || keywords[i] === speech.action) {
        blackList.push(keywords[i]);
      }
    }

    for (let i = 0; blackList.length > i; i++) {
      const index = keywords.indexOf(blackList[i]);
      if (index !== -1) {
         keywords.splice(index, 1);
      }
    }

    speech.keywords = keywords;
  }

  _extractAction(speech) {
    for (let i = 0; this._actions.length > i; i++) {
      let action = this._actions[i].toLowerCase().trim();
      if (speech.text.indexOf(action) != -1) {
        speech.action = action;
        break;
      }
    }
    return speech;
  }

}

export default Assistant;
