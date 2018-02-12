import VoiceRecognition from './VoiceRecognition';
import VoiceSynthesizer from './VoiceSynthesizer';
import Assistant from './Assistant';

/**
 * Voice assistant api.
 *
 * @class
 */
class VoiceAssistant {

  /**
   * Init the Recognition and Synthesizer voice's api.
   * @param {object} settings - The Voice assistant config.
   * @return {Promise}
   */
  static start(settings) {
    return new Promise((resolve, reject) => {
      if (!VoiceRecognition.isSupported()) {
        reject('Voice recognition is not supported for this Browser.');
      } else if (!VoiceSynthesizer.isSupported()) {
        reject('Voice synthesizer is not supported for this Browser.');
      } else {
        const recognition = new VoiceRecognition(
          settings.lang,
          settings.grammar,
          settings.debug
        );

        const synthesizer = new VoiceSynthesizer(
          settings.lang,
          settings.volume,
          settings.voiceId,
          settings.debug
        );

        synthesizer.init().then(() => {
          resolve(new Assistant(
            recognition,
            synthesizer,
            settings.startCommand,
            settings.soundEffect,
            settings.actions,
            settings.stopWords,
            settings.debug
          ));
        });
      }
    });
  }

}

export default VoiceAssistant;
