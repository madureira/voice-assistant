/**
 * Voice recognition api.
 *
 * @class
 */
class VoiceRecognition {

  constructor(lang, phrases, debug = false) {
    this.debug = debug;
    const grammar = '#JSGF V1.0; grammar phrases; public <phrases> = ' + phrases.join(' | ') + ';';
    this.recognition = new (VoiceRecognition._instance())();

    const speechRecognitionList = new (VoiceRecognition._grammar())();
    speechRecognitionList.addFromString(grammar, 1);
    this.recognition.grammars = speechRecognitionList;

    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = lang;
    this.started = false;

    this.recognition.onstart = () => {
      if (this.debug) console.log('DEBUG: Recognition start...');
      this.started = true;
    };

    this.recognition.onend = () => {
      if (this.debug) console.log('DEBUG: Recognition end!');
      this.started = false;
      this.recognition.start();
    };

    this.recognition.onnomatch = (event) => {
      if (this.debug) console.log('DEBUG: No match!');
    }
  }

  /**
   * Listen user's speech.
   * @param {function} - Callback to user's speech.
   */
  listen(speechCallback) {
    this.recognition.onresult = (event) => {
      let speech = event.results[event.resultIndex][0];
      speechCallback({
        text: speech.transcript.trim().toLowerCase(),
        confidence: speech.confidence
      });
    }

    if (!this.started) {
      this.recognition.start();
    }
  }

  /**
   * Check if browser supports SpeechRecognition.
   * @return {boolean} - Support confirmation.
   */
  static isSupported() {
    return VoiceRecognition._instance() && VoiceRecognition._grammar() ? true : false;
  }

  /**
   * Return an instance of SpeechRecognition.
   * @return {object} - SpeechRecognition Api.
   */
  static _instance() {
    return (window.SpeechRecognition
      || window.webkitSpeechRecognition
      || window.mozSpeechRecognition
      || window.msSpeechRecognition
    );
  }

  /**
   * Return an instance of SpeechGrammarList.
   * @return {object} - SpeechGrammarList Api.
   */
  static _grammar() {
    return (window.SpeechGrammarList || window.webkitSpeechGrammarList);
  }

}

export default VoiceRecognition;
