/**
 * Voice synthesizer api.
 *
 * @class
 */
class VoiceSynthesizer {

  static isSupported() {
    return ('speechSynthesis' in window);
  }

  constructor(lang, volume, voiceId, debug = false) {
    window.utterances = [];
    this.lang = lang;
    this.volume = volume;
    this.voiceId = voiceId;
    this.voices = window.speechSynthesis.getVoices();
    this.voicesLoaded = false;
    this.debug = debug;
  }

  /**
   * Initiate the synthesizer and load voices.
   * @return {Promise}
   */
  init() {
    return new Promise((resolve, reject) => {
      // waiting voices to be loaded..
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
        this.utterance = new window.SpeechSynthesisUtterance;
        this.utterance.voice = this.voices[this.voiceId];
        this.utterance.voiceURI = 'native';
        this.utterance.volume = this.volume;
        this.utterance.lang = this.lang;

        if (this.voices.length > 0 && !this.voicesLoaded) {
          this.voicesLoaded = true;
          resolve();
        }
      };
    });

  }

  /**
   * Speak the text.
   * @param {string} text - The text to speak.
   * @param {function} The callback to execute when finished to speak.
   */
  say(text) {
    return new Promise((resolve, reject) => {
      if (!text) resolve();
      window.speechSynthesis.cancel();

      this.utterance.text = text;

      if (this.debug) console.log('DEBUG: Start speak -> ', text);

      window.utterances.push(this.utterance);  // work around to BUG in utterances.

      this.utterance.onend = () => {
        console.log('finished');
        resolve();
      };

      window.speechSynthesis.speak(this.utterance);
    });
  }

}

export default VoiceSynthesizer;
