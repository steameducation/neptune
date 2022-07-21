const facts = {
  en: {
    mercury: [
      {
        fact: 'Mercury is the fastest-moving planet around the Sun. It was named after the Roman messenger God Mercury.',
      },
      {
        fact: 'Mercury is the smallest planet in the Solar System measuring 4880 kms (3032 miles) wide at its equator.',
      },
      {
        fact: 'It is impossible to live on Mercury due to its extreme temperatures: -173 °C (-279 °F) at night to 427 °C (801 °F) during the day. ',
      },
      { fact: 'A year lasts only 88 Earth days on Mercury. ' },
      {
        fact: 'The Hubble Space Telescope cannot view Mercury because it is too close to the Sun, so the equipment would be damaged.',
      },
    ],

    venus: [
      {
        fact: 'Venus is a Roman Goddess, whose powers encompassed love, beauty, desire, sex, fertility, prosperity and victory.',
      },
      {
        fact: 'Venus rotates very slowly: it takes 243 Earth days to complete 1 rotation around its axis and 225 to complete its orbit around the sun. Strangely enough, a “year” lasts shorter than a “day” on Venus!',
      },
      {
        fact: 'Venus is the warmest planet in our solar system, although Mercury is much closer to the sun.',
      },
      {
        fact: 'The ‘Venus de Milo’ is a famous ancient Greek statue. It is currently on permanent display at the Louvre Museum in Paris. ',
      },
      {
        fact: 'Venus is the second brightest natural object in the night sky after the Moon.',
      },
    ],

    earth: [
      {
        fact: 'The Earth is the only planet in our solar system not to be named after a Greek or Roman deity. ',
      },
      {
        fact: 'The Earth was formed approximately 4.54 billion years ago and is the only known planet to support life.',
      },
      {
        fact: 'The Earth was once believed to be the centre of the universe.',
      },
      {
        fact: '70% of our planet is covered with oceans. When astronauts first went into the space, they looked back at the Earth and called our home the Blue Planet.',
      },
      {
        fact: 'Each winter there are about 1 septillion (1,000,000,000,000,000,000,000,000 or a trillion trillion) snow crystals that drop from the sky.',
      },
    ],

    mars: [
      { fact: 'The planet is named after Mars, the Roman god of war.' },
      {
        fact: 'Mars is often referred to as the ‘Red Planet’ because of the reddish iron oxide prevalent on its surface.',
      },
      {
        fact: 'Mars was once believed to be home to intelligent life and – with the exception of Earth – Mars is the most hospitable to life.',
      },
      {
        fact: 'Mars has seasons like Earth, but they last twice as long.',
      },
      { fact: 'David Bowie has an album called “Life on Mars”.' },
    ],

    jupiter: [
      {
        fact: 'Although Jupiter is named after the King of the Roman gods, the Greeks knew it as Zeus, the god of thunder.',
      },
      {
        fact: 'Jupiter is twice as big as all the other planets combined. More than 1,300 Earths would fit inside of Jupiter!',
      },
      {
        fact: "On Jupiter you would feel the force of gravity about 2.4 times stronger than on Earth's surface. So if you weighed 50 kg (110 pounds) here, you would weigh 120 kg (265 pounds) there!",
      },
      {
        fact: "Jupiter’s Great Red Spot is actually a storm in its atmosphere. It has been raging for over 300 years and is so big that three Earth's could fit inside it!",
      },
      {
        fact: 'Jupiter is composed primarily of gaseous and liquid matter. ',
      },
    ],

    saturn: [
      {
        fact: 'Saturn was named after the Roman god of agriculture and time. It is the slowest of the five bright planets.',
      },
      {
        fact: 'Saturn is also known as the ‘Jewel of the Solar System’, because of its beautiful and mysterious rings and appearance.',
      },
      {
        fact: 'Saturn’s wind can blow up to 1800 kilometers (1118 miles) per hour, which makes it the windiest planet in our Solar System.',
      },
      {
        fact: 'Saturn is so big that Earth could fit into it a whopping 755 times!',
      },
      {
        fact: 'The circumstances on Saturn are simply too hostile for the emergence of life.',
      },
    ],

    uranus: [
      {
        fact: 'Uranus was named after the Greek sky deity Ouranos, the earliest of the lords of the heavens.',
      },
      {
        fact: 'In 1781, Uranus became the first planet discovered with the use of a telescope. At that time it was the first planet to be discovered in about 1000 years.',
      },
      {
        fact: 'Uranus is often referred to as an ‘ice giant’ planet and hits the coldest temperatures of all planets: - 224 °C (-435 °F). It has 13 rings.',
      },
      {
        fact: 'Uranus’ poles lies West and East, equator South to North.',
      },
      {
        fact: 'Uranus’ moons are named after characters created by William Shakespeare and Alexander Pope.',
      },
    ],

    neptune: [
      {
        fact: 'Because of its blue color, Neptune is named after the Roman god of freshwater and the sea, identified with the Greek Poseidon.',
      },
      {
        fact: 'As is the case on Uranus, it can be quite cold on Neptune, with temperatures that fall to -221 °C (-430 °F).',
      },
      {
        fact: 'It takes Neptune almost 165 Earth years to circle around the sun.',
      },
      {
        fact: 'The scientist Galilei was the first person who saw Neptune although he did not recognize it as a planet.',
      },
      {
        fact: 'Neptune has a storm similar to the Great Red Spot on Jupiter. It is commonly known as the Great Dark Spot and is roughly the size of Earth. ',
      },
    ],
  },
  pt: {
    mercury: [
      {
        fact: 'Mercúrio é o planeta que mais rapidamente se desloca à volta do Sol. O seu nome vem do Deus mensageiro Romano.',
      },
      {
        fact: 'Mercúrio é o planeta mais pequeno no sistema solar, com um perímetro de 4880 kms (3032 milhas) à volta do equador.',
      },
      {
        fact: 'É impossível viver em Mercúrio por causa das suas temperaturas extremamente elevadas: -173 °C (-279 °F) à noite e 427 °C (801 °F) de dia. ',
      },
      { fact: 'Um ano dura apenas 88 dias terrestres em Mercúrio.' },
      {
        fact: 'O Telescópio Espacial Hubble não consegue visualizar Mercúrio por estar demasiado perto do Sol, o que danificaria o equipamento.',
      },
    ],

    venus: [
      {
        fact: 'Vénus é uma Deusa Romana, cujos poderes incluem o amor, a beleza, o desejo, o sexo, a fertilidade, a prosperidade e a vitória.',
      },
      {
        fact: 'Vénus roda muito lentamente: leva 243 dias terrestres a completar uma rotação à volta do seu eixo e 225 para completar uma órbita à volta do sol. Estranhamento, em Vénus, um “ano” é mais curto que um “dia”.',
      },
      {
        fact: 'Vénus é o planeta mais quente do sistema solar, apesar de Mercúrio estar mais perto do Sol.',
      },
      {
        fact: 'A “Vénus de Milo” é uma estátua da antiguidade grega muito conhecida. Está actualmente em exposição no Museu do Louvre, em Paris.',
      },
      {
        fact: 'Vénus é o segundo objecto natural mais brilhante no céu nocturno, logo a seguir à Lua.',
      },
    ],

    earth: [
      {
        fact: 'A Terra é o único planeta do nosso sistema solar cujo nome não vem de uma divindade grega ou romana.',
      },
      {
        fact: 'A Terra formou-se há aproximadamente 4.54 mil milhões de anos, e é o único planeta que sabemos que alberga a vida.',
      },
      {
        fact: 'Outrora acreditava-se que a Terra era o centro do universo.',
      },
      {
        fact: '70% do nosso planeta é coberto pelos oceanos. Quando os astronautas viajaram pela primeira vez ao espaço e olharam para a Terra, chamaram-lhe o Planeta Azul.',
      },
      {
        fact: 'Em cada Inverno há cerca de 1 septilhão (1,000,000,000,000,000,000,000,000 ou um trilião de triliões) de cristais de neve que caem do céu.',
      },
    ],

    mars: [
      {
        fact: 'O planeta herdou o seu nome do Deus Romano da Guerra, Marte.',
      },
      {
        fact: 'Marte é frequentemente chamado de “Planeta Vermelho”, por causa do óxido de ferro, avermelhado, comum na sua superfície.',
      },
      {
        fact: 'Outrora acreditou-se que Marte teria vida inteligente e, com a excepção da Terra, é o planeta com melhores condições para albergar a vida.',
      },
      {
        fact: 'Marte tem estações, como a Terra, mas elas duram o dobro do tempo.',
      },
      {
        fact: 'David Bowie tem um álbum intitulado “Life on Mars” – “Vida em Marte”.',
      },
    ],

    jupiter: [
      {
        fact: 'Apesar de Júpiter ter o nome do Rei dos Deuses Romanos, os Gregos conheciam-nos como Zeus, o Deus do Trovão.',
      },
      {
        fact: 'Júpiter tem o dobro do tamanho de todos os outros combinados. Mais de 1300 Terras caberiam dentro de Júpiter.',
      },
      {
        fact: 'Em Júpiter sentiríamos a força da gravidade com 2.4 vezes a intensidade, quando comparada com a da superfície terrestre.',
      },
      {
        fact: 'A Grande Mancha Vermelha de Júpiter é na verdade um anticiclone na sua superfície. Está em actividade há mais de 300 anos e é tão grande que caberiam três Terras no seu interior!',
      },
      {
        fact: 'Júpiter é composto principalmente de matéria gasosa e líquida.',
      },
    ],

    saturn: [
      {
        fact: 'Saturno tem o nome do Deus Romano da Agricultura e do Tempo. É o mais lento dos cinco planetas luminosos.',
      },
      {
        fact: 'Saturno é também conhecido como a “Jóia do Sistema Solar”, por causa dos seus belos e misteriosos anéis e aparência.',
      },
      {
        fact: 'O vento em Saturno pode soprar a velocidades de até 1800 km (1118 milhas) por hora, tornando-o no planeta mais ventoso do Sistema Solar.',
      },
      {
        fact: 'Saturno é tão grande que a Terra caberia dentro dele umas espantosas 755 vezes.',
      },
      {
        fact: 'As condições em Saturno são simplesmente demasiado hostis para o surgimento de vida.',
      },
    ],

    uranus: [
      {
        fact: 'Urano tem o nome da divindade Grega Urano, um dos mais antigos senhores dos céus.',
      },
      {
        fact: 'Em 1781, Urano tornou-se no primeiro planeta descoberto com o uso de um telescópio. Nessa altura, não se descobria um novo planeta há cerca de 1000 anos.',
      },
      {
        fact: 'Urano é frequentemente chamado de “Gigante Gelado”, por atingir as temperaturas mais baixas de todos os planetas: -224 ºC (-435 ºF). Tem 13 anéis.',
      },
      {
        fact: 'Os pólos de Urano situam-se a Este e a Oeste, e o seu equador no eixo Norte-Sul.',
      },
      {
        fact: 'As luas de Urano herdaram o nome de personagens criadas por William Shakespeare e Alexander Pope.',
      },
    ],

    neptune: [
      {
        fact: 'Por causa da sua cor azul, Neptuno tem o nome do Deus Romano da Água e do Mar, por sua vez uma referência ao Deus Grego Posídon.',
      },
      {
        fact: 'Como em Urano, Neptuno pode atingir temperaturas muito baixas, com temperaturas abaixo de -221 ºC (-430 ºF).',
      },
      {
        fact: 'Neptuno leva quase 165 anos terrestres para concluir uma volta ao Sol.',
      },
      {
        fact: 'O cientista Galileu foi a primeira pessoa a observar Neptuno, embora não o tenha reconhecido como planeta.',
      },
      {
        fact: 'Neptuno tem uma tempestada parecida com a Grande Mancha Vermelha de Júpiter. É chamada de Grande Mancha Escura e tem, aproximadamente, o tamanho da Terra.',
      },
    ],
  },
}

export default facts
