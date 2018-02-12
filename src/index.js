import VoiceAssistant from './core/VoiceAssistant';

const setSearchFieldValue = (value) => {
  return document.getElementById('search').value = value;
};

const getLocation = () => {
  return document.getElementById('location').innerText.replace('/', '').replace('Página:', '');
};


window.addEventListener('load', (event) => {
  VoiceAssistant.start({
    lang: 'pt-BR',
    volume: 1,
    voiceId: 16,  // 0 or 16 - Portuguese
    startCommand: 'Ok Luiza',
    soundEffect: '/assets/audio/beep.wav',
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
      'ir para meu carrinho',
      'inicial',
      'página inicial',
      'onde estou'
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
    actions: ['descreva', 'pesquisar', 'buscar', 'pedido', 'carrinho', 'sacola', 'inicial', 'onde estou'],
    debug: true
  })
  .then((assistant) => {
    assistant.listen((speech) => {
      let keywords = speech.keywords.join(' ');
      const action = speech.action;

      if (['pesquisar', 'buscar'].indexOf(action) !== -1 && keywords.length > 0) {
        assistant.say('Pesquisando ' + keywords, () => {
          setSearchFieldValue(keywords);
        });
      } else if (['carrinho', 'sacola'].indexOf(action) !== -1) {
        assistant.say('Redirecionando para a página do carrinho', () => {
          window.location.replace('/carrinho');
        });
      } else if (action === 'pedido') {
        assistant.say('Redirecionando para a página de pedidos', () => {
          window.location.replace('/pedidos');
        });
      } else if (action === 'inicial') {
        assistant.say('Redirecionando para a página inicial', () => {
          window.location.replace('/');
        });
      } else if (action === 'onde estou') {
        assistant.say('Você está na página: ' + getLocation());
      } else if (action === 'descreva') {
        assistant.describePage();
      } else {
        assistant.say('Não entendi o que deseja. Você pode repetir?');
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });
});
