import VoiceSynthesizer from './voice-synthesizer';
import VoiceRecognizer from './voice-recognizer';

class VoiceAssistant {

  static isSupported() {
    return VoiceSynthesizer.isSupported() && VoiceRecognizer.isSupported();
  }

  constructor(config) {
    this._mainCommand = config.mainCommand.toLowerCase().trim();
    this._voiceSynthesizer = new VoiceSynthesizer(config.lang, config.volume, config.speed);
    this._voiceRecognizer = new VoiceRecognizer(config.lang, config.grammar);
    this.callbackListeners = [];
    this.isRecognizerListening = false;
  }

  listen(actions, callback) {
    this.callbackListeners.push({
      callback: callback,
      actions: actions.map(action =>
        action.trim().toLowerCase().replace(/[^a-zA-Z\s]/g, '')
      )
    });

    if (!this.isRecognizerListening) {
      this.isRecognizerListening = true;
      this._voiceRecognizer.listen(speech => {
        const speechText = speech.text.toLowerCase().trim();
        const isStartCommand = speechText === this._mainCommand;

        console.log(speechText);

        if (!isStartCommand) {
          this.callbackListeners.forEach(listener => {
            listener.actions.forEach(action => {
              if (speechText.includes(action)) {
                listener.callback();
              }
            });
          });
        }
      });
    }
  }

  say(speech, callback = () => {}) {
    this._voiceRecognizer.pause();
    this._voiceSynthesizer.say(speech).then(() => {
      this._voiceRecognizer.resume();
      if (typeof callback === 'function') {
        setTimeout(callback, 200);
      }
    });
  }

}

export default VoiceAssistant;
