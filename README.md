Aplicativo de Pontos Turísticos
Este é um aplicativo para criação, visualização e gestão de pontos turísticos, que permite aos usuários adicionar locais turísticos por meio de fotos tiradas diretamente do dispositivo móvel, incluindo informações de localização (latitude e longitude). O aplicativo permite armazenar as informações de forma local, mas também possui integração com um backend para persistência dos dados em um servidor.

Funcionalidades
Criação de pontos turísticos: Permite ao usuário cadastrar um novo ponto turístico com um nome, descrição, uma foto tirada do dispositivo e as coordenadas geográficas (latitude e longitude).

Exibição de pontos turísticos: Mostra uma lista dos pontos turísticos cadastrados com seu nome, descrição e foto.

Busca por nome: Permite buscar pontos turísticos cadastrados por nome, facilitando a localização dos lugares desejados.

Edição de pontos turísticos: O usuário pode editar informações dos pontos turísticos já cadastrados, como nome, descrição e foto.

Deleção de pontos turísticos: O usuário pode excluir pontos turísticos cadastrados.

Visualização no mapa: Possui uma funcionalidade para visualizar os pontos turísticos em um mapa, facilitando a localização geográfica.

Armazenamento local: Caso o servidor backend não esteja disponível, os dados podem ser carregados e armazenados localmente utilizando o AsyncStorage do React Native.

Tecnologias Utilizadas
Frontend (React Native)
React Native: Framework para desenvolvimento de aplicativos móveis nativos.

React Navigation: Biblioteca para navegação entre telas do aplicativo.

React Native Paper: Biblioteca para componentes de UI (botões, cards, inputs, etc.).

AsyncStorage: Utilizado para armazenar dados localmente no dispositivo.

Expo: Ferramenta para desenvolvimento e execução do aplicativo, caso o projeto seja rodado com Expo.

Backend (Node.js com Express)
Node.js: Ambiente de execução JavaScript no backend.

Express: Framework para criar rotas e gerenciar o servidor.

Multer: Middleware para upload de arquivos (fotos).

CORS: Configuração para permitir requisições de diferentes origens.

File System (fs): Utilizado para gerenciar o armazenamento de arquivos localmente no servidor.

Path: Módulo utilizado para lidar com os caminhos de arquivos.

Instalação
Frontend (React Native)
Clone o repositório:

bash
Copiar
Editar
git clone <URL_DO_REPOSITORIO>
cd nome_do_projeto
Instale as dependências:

bash
Copiar
Editar
npm install
Se você estiver utilizando o Expo, pode rodar o aplicativo com:

bash
Copiar
Editar
expo start
Caso contrário, utilize o comando para o React Native CLI:

bash
Copiar
Editar
npx react-native run-android   # Para Android
npx react-native run-ios       # Para iOS
Alterar a URL da API para apontar para o seu backend (servidor):

No arquivo HomeScreen.js, altere a variável API_URL para a URL correta do seu servidor:

js
Copiar
Editar
const API_URL = 'http://<SEU_IP_LOCAL>:3000'; // Para dispositivo físico
// const API_URL = 'http://10.0.2.2:3000'; // Para emulador Android
// const API_URL = 'http://localhost:3000'; // Para emulador iOS
Backend (Node.js com Express)
Clone o repositório do backend:

bash
Copiar
Editar
git clone <URL_DO_REPOSITORIO_BACKEND>
cd nome_do_projeto_backend
Instale as dependências:

bash
Copiar
Editar
npm install
Inicie o servidor:

bash
Copiar
Editar
node server.js
O servidor irá rodar na porta 3000 por padrão.

Endpoints da API
GET /tourist-points
Recupera todos os pontos turísticos cadastrados.

Resposta: Lista de pontos turísticos com nome, descrição, foto, latitude e longitude.

POST /tourist-points
Adiciona um novo ponto turístico com foto e informações de localização.

Corpo da Requisição:

json
Copiar
Editar
{
  "name": "Nome do Ponto",
  "description": "Descrição do ponto turístico",
  "latitude": "Latitude",
  "longitude": "Longitude",
  "photo": "Arquivo de imagem"
}
Resposta: Ponto turístico criado com sucesso.

DELETE /tourist-points/:id
Deleta um ponto turístico específico pelo id.

GET /tourist-points/:id
Recupera as informações de um ponto turístico específico pelo id.

Uso do Aplicativo
Página inicial: A tela inicial exibe a lista de pontos turísticos cadastrados, com nome, descrição e foto. É possível buscar pontos turísticos pelo nome na barra de pesquisa.

Adicionar ponto turístico: Ao clicar no botão de "+" (no canto inferior direito), você é direcionado para a tela de cadastro, onde pode inserir o nome, descrição, tirar uma foto e adicionar a localização.

Editar ponto turístico: Ao clicar no ícone de lápis ao lado de um ponto turístico, é possível editar suas informações.

Deletar ponto turístico: Ao clicar no ícone de lixeira ao lado de um ponto turístico, você pode confirmar a exclusão do mesmo.

Ver mapa: Ao clicar no ícone de mapa, você pode visualizar todos os pontos turísticos em um mapa com suas localizações geográficas.

Notas de Implementação
Upload de Foto: O aplicativo utiliza o Multer no backend para gerenciar o upload de fotos. As fotos são salvas no servidor e suas URLs são armazenadas no banco de dados.

Armazenamento Local: Quando o servidor não está acessível, o aplicativo carrega os dados de pontos turísticos armazenados localmente utilizando o AsyncStorage. Isso permite que o usuário continue interagindo com os dados mesmo sem conexão com a internet.

Geolocalização: A localização do ponto turístico pode ser inserida manualmente ou obtida automaticamente via GPS do dispositivo (dependendo da implementação).

Contribuição
Sinta-se à vontade para contribuir! Abra uma issue ou envie um pull request para sugerir melhorias ou corrigir bugs.

Licença
Este projeto está licenciado sob a MIT License.
