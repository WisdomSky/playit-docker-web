const express = require('express')
const app = express()
const port = process.env.WEBUI_PORT;
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');
const fs = require('fs');

const { PlayitTunnel } = require('./playit-tunnel.js');
const tunnel = new PlayitTunnel();

const configpath = "/config/config.json";

const viewpath = path.normalize(__dirname + '/../frontend/dist');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

app.use(express.static(viewpath));

app.get('/', (req, res) => {
  res.sendFile(viewpath + "index.html");
})

app.get('/config', (req, res) => {
  let config = getConfig();
  res.status(200).set('Content-Type', 'application/json').send(JSON.stringify(config));
})

app.post('/start', (req, res) => {
  let config = getConfig();
  config.secret = req.body.secret;
  saveConfig(config);
  agentStart();
})

app.get('/new-version', async (req, res) => {
  const current_version = process.env.VERSION;

  const resp = await fetch('https://registry.hub.docker.com/v2/repositories/wisdomsky/playit-docker-web/tags/?page_size=100&page=1');

  const image_info = await resp.json();

  const tags = image_info.results.filter(tag => tag.name !== 'latest')

  const latest_version = tags[0].name;

  res.status(200).set('Content-Type', 'application/json').send({
    current_version,
    latest_version,
    update: current_version !== latest_version
  });
})



app.listen(port, () => {
  console.log(`WebUI running on port ${port}`);

  agentStart();

})


function getConfig() {
  let config = {
    secret: ''
  };
  try {
    const json = JSON.parse(fs.readFileSync(configpath));
    if (json.secret !== undefined && json.secret.trim().length) {
      config = json;
    }
  } catch(e) {
    console.log('No pre-existing config file found.');
  }
  return config;
}


function saveConfig(config) {
  fs.writeFileSync(configpath, JSON.stringify(config, null, 2) + "\n");
}


function agentStart() {
  let config = getConfig();
  if (config.secret.trim().length) {
    console.log('Starting playit agent.');
    tunnel.start(config.secret);
  }
}