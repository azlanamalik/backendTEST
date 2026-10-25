const http = require('node:http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from Node', path: req.url }));
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
