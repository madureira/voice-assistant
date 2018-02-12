import VoiceAssistant from './core/VoiceAssistant';

const searchField = () => {
  return document.getElementById('search');
};

const locationField = () => {
  return document.getElementById('location');
};

window.addEventListener('load', (event) => {
  VoiceAssistant.start({
    lang: 'pt-BR',
    volume: 1,
    voiceId: 16,  // 0 or 16 - Portuguese
    startCommand: 'Ok Luiza',
    soundEffect: '/static/audio/beep.wav',
    grammar: [
      'ok',
      'Luiza',
      'Ok Luiza',
      'pesquisar',
      'pesquisar por',
      'pedidos',
      'meus pedidos',
      'ir para meus pedidos',
      'carrinho',
      'meu carrinho',
      'ir para meu carrinho'
    ],
    stopWords: [
      'o',
      'a',
      'um',
      'uma',
      'por',
      'para',
      'de',
      'da',
      'ok',
      'luiza'
    ],
    actions: ['descreva', 'pesquisar', 'buscar', 'pedido', 'carrinho', 'sacola', 'onde estou'],
    debug: true
  })
  .then((assistant) => {
    assistant.listen((speech) => {
      let keywords = speech.keywords.join(' ');
      const action = speech.action;

      if (['pesquisar', 'buscar'].indexOf(action) !== -1 && keywords.length > 0) {
        assistant.say('Pesquisando ' + keywords, () => {
          searchField().value = keywords;
        });
      } else if (['carrinho', 'sacola'].indexOf(action) !== -1) {
        assistant.say('Redirecionando para a página do carrinho', () => {
          locationField().innerHTML = 'Page: /carrinho';
        });
      } else if (action === 'pedido') {
        assistant.say('Redirecionando para a página de pedidos', () => {
          locationField().innerHTML = 'Page: /pedidos';
        });
      } else if (action === 'onde estou') {
        const page = locationField().innerText.replace('/', '').replace('Page:', '');
        assistant.say('Você está na página: ' + page);
      } else if (action === 'descreva') {
        assistant.say('Você está em uma página com 3 produtos');
      } else {
        assistant.say('Não entendi o que deseja. Você pode repetir?');
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });
});
