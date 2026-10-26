// Local-only preview of the exported SPA, including history-route reloads.
const { existsSync } = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const handler = require('serve-handler');

const directory = path.resolve(__dirname, '../dist');
if (!existsSync(path.join(directory, 'index.html'))) {
  throw new Error('Run npm run build:web before starting the preview.');
}

http.createServer((request, response) => handler(request, response, {
  public: directory,
  rewrites: [{ source: '**', destination: '/index.html' }],
})).listen(4173, '127.0.0.1', () => {
  console.log('Portfolio preview: http://127.0.0.1:4173');
});
