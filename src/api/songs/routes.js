const routes = (handler) => [
  {
    // Simpan lagu
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
  },
  {
    // tampilkan semua note
    method: 'GET',
    path: '/songs',
    handler: handler.getAllSongsHandler,
  },
  {
    // tampilkan note sesuai Id
    method: 'GET',
    path: '/songs/{songId}',
    handler: handler.getSongsByIdHandler,
  },
  {
    // edit note sesuai Id
    method: 'PUT',
    path: '/songs/{songId}',
    handler: handler.putSongByIdHandler,
  },
  {
    // hapus note sesuai Id
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: handler.deleteSongByIdHandler,
  },
];

module.exports = routes;
