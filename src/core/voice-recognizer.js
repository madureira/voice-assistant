class VoiceRecognizer {

  constructor(lang, phrases) {
    const grammar = '#JSGF V1.0; grammar phrases; public <phrases> = ' + phrases.join(' | ') + ';';
    this.recognition = new (VoiceRecognizer._instance())();

    const speechRecognitionList = new (VoiceRecognizer._grammar())();
    speechRecognitionList.addFromString(grammar, 1);
    this.recognition.grammars = speechRecognitionList;

    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = lang;
    this.isStarted = false;

    this.speechCallbacks = [];

    this.recognition.onstart = () => {
      this.isStarted = true;
      console.log('DEBUG: Recognition start...');
    };

    this.recognition.onend = () => {
      this.isStarted = false;
      console.log('DEBUG: Recognition end!');
      if (!this.isPaused) {
        this.recognition.start();
      }
    };

    this.recognition.onresult = event => {
      let speech = event.results[event.resultIndex][0];
      this.speechCallbacks.forEach(callback => callback({
        text: speech.transcript.trim().toLowerCase(),
        confidence: speech.confidence
      }));
    }

    this.recognition.start();
  }

  listen(callback) {
    this.speechCallbacks.push(callback);
  }

  pause() {
    this.isPaused = true;
    this.recognition.stop();
  }

  resume() {
    this.isPaused = false;
    if (!this.isStarted) {
      this.recognition.start();
    }
  }

  static isSupported() {
    return Boolean(VoiceRecognizer._instance()) && Boolean(VoiceRecognizer._grammar());
  }

  static _instance() {
    return window.SpeechRecognition
      || window.webkitSpeechRecognition
      || window.mozSpeechRecognition
      || window.msSpeechRecognition;
  }

  static _grammar() {
    return window.SpeechGrammarList || window.webkitSpeechGrammarList;
  }

}

export default VoiceRecognizer;
