class VoiceSynthesizer {

  constructor(lang, volume, speed) {
    window.utterances = [];
    this.lang = lang;
    this.volume = volume;
    this.speed = speed;
    this.voices = window.speechSynthesis.getVoices();
    this.voicesLoaded = false;

    window.speechSynthesis.onvoiceschanged = () => {
      this.voices = window.speechSynthesis.getVoices();
      let voiceId = 0;

      this.voices.forEach((voice, index) => {
        if (voice.lang === this.lang) {
          voiceId = index;
        }
      });

      this.utterance = new window.SpeechSynthesisUtterance;
      this.utterance.voice = this.voices[voiceId];
      this.utterance.voiceURI = 'native';
      this.utterance.volume = this.volume;
      this.utterance.lang = this.lang;
      this.utterance.rate = this.speed;

      if (this.voices.length > 0 && !this.voicesLoaded) {
        this.voicesLoaded = true;
      }
    };
  }

  say(text) {
    return new Promise((resolve, reject) => {
      if (!text || !text.trim()) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      this.utterance.text = text;
      window.utterances.push(this.utterance);  // work around to BUG in utterances.

      this.utterance.onend = () => {
        resolve();
      };

      window.speechSynthesis.speak(this.utterance);
    });
  }

  static isSupported() {
    return 'speechSynthesis' in window;
  }

}

export default VoiceSynthesizer;
