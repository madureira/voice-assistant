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
      'how',
      'are',
      'you',
      'doing',
      'how are',
      'how are you',
      'how are you doing',
      'robot'
    ]
  };

  const assistant = new VoiceAssistant(config);

  assistant.listen(['How are you?', 'How are you doing?'], () => {
    assistant.say('I am fine, thanks!');
  });

  assistant.listen(['Are you a robot?'], () => {
    assistant.say('Course not, I\'m a human, trust-me!');
  });

  assistant.listen(['Do you love me?'], () => {
    assistant.say('Oh, come on, seriously?');
  });

  assistant.listen(['What?'], () => {
    assistant.say('Say what again. SAY WHAT again! And I dare you, I double dare you motherfucker!', () => {
      assistant.say('Say WHAT one more goddamn time!');
    });
  });

});
