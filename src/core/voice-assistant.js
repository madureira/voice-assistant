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
          for (let i = 0; i < this.callbackListeners.length; i++) {
            let match = false;
            const listener = this.callbackListeners[i];
            for (let j = 0; j < listener.actions.length; j++) {
              const action = listener.actions[j];
              if (speechText.includes(action)) {
                listener.callback();
                match = true;
                break;
              }
            }
            if (match) break;
          }
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
