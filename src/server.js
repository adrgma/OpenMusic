require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const TokenManager = require('./tokenize/TokenManager');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// Albums
const AlbumsService = require('./services/postgres/AlbumsService');
const albums = require('./api/albums');
const AlbumsValidator = require('./validator/albums');

// Users
const UsersService = require('./services/postgres/UsersService');
const users = require('./api/users');
const UsersValidator = require('./validator/users');

// Authentications
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const authentications = require('./api/authentications');
const AuthenticationsValidator = require('./validator/authentications');

// Collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// Playlistsongs
const playlistsongs = require('./api/playlistsongs');
const PlaylistsongsService = require('./services/postgres/PlaylistsongsService');
const PlaylistsongsValidator = require('./validator/playlistsongs');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const usersService = new UsersService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistsongsService = new PlaylistsongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('listsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        usersService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        playlistsongsService,
        playlistsService,
        validator: PlaylistsongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
