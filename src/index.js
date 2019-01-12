import VoiceAssistant from './core/voice-assistant';

window.addEventListener('load', event => {
  if (!VoiceAssistant.isSupported()) {
    console.log('Your browser do not supports voice assistant :(');
    return;
  }

  const config = {
    lang: 'en-US',
    volume: 1,
    speed: 1,
    mainCommand: 'show',
    soundEffect: '/assets/audio/beep.wav',
    grammar: [
      'How are you',
      'How are you doing',
      'Are you a robot',
      'Do you love me'
    ]
  };

  const assistant = new VoiceAssistant(config);

  assistant.listen(['Hello'], () => {
    assistant.say('Hi, I am your voice assistant, let\'s talk?');
  });

  assistant.listen(['How are you?', 'How are you doing?'], () => {
    assistant.say('I am pretty good, thanks!', () => {
      assistant.say('How about you?');
    });
  });

  assistant.listen(['Are you a robot?'], () => {
    assistant.say('Course not, I am a human, trust-me!');
  });

  assistant.listen(['Do you love me?'], () => {
    assistant.say('Oh, come on, seriously?');
  });
});
