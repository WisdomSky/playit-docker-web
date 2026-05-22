<template>
  <div>
    <div>
      <img src="./assets/playit-logo.png" class="playit-logo" alt="Playit.gg">
    </div>
    <form id="cf-form" method="post" @submit.prevent v-if="!hasSecret">
      <div>
        <div style="margin-top: 15px">
          <h4>SETTING UP PLAYIT.GG AGENT</h4>
        </div>
      </div>
      <div v-if="step == 1">
        <div>
          <button @click.prevent="step = 2">Click to Start Setup</button>
        </div>
      </div>
      <div v-if="step == 2" class="step-2">
        <div>
          <div>
            <strong>1. Generate a PlayIt secret key.</strong>
          </div>
          <div>
            <button @click.prevent="getPlayItSecretKey()">Open PlayIt Agent Wizard</button>
          </div>
        </div>
        <div>
          <div>
            <strong>1. Choose a name for your docker agent.</strong>
          </div>
          <div>
            <img src="./assets/setup/1.png">
          </div>
        </div>
        <div>
          <div>
            <strong>2. Copy the secret key or the docker run command.</strong>
          </div>
          <div>
            <img src="./assets/setup/2.png">
          </div>
        </div>
        <div>
          <div>
            <strong>2. Paste it below.</strong>
          </div>
          <div>
              <input type="text" name="token" style="text-align: center" v-model="secret" :disabled="processing" :readonly="processing" placeholder="docker run --rm -it --net=host -e SECRET_KEY=56fde841223eb0c8b04ec6fff7c9e1542d35ab7cf6647bbc08d5a8ca52a7a903 ghcr.io/playit-cloud/playit-agent:0.17">
          </div>
          <div v-if="secret.length">
            <button @click.prevent="startPlayIt()" :disabled="processing">Start PlayIt</button>
          </div>
        </div>
      </div>
      <div v-if="step == 3" class="step-3">
        <div>
          <div>
            <strong>Once the agent has been setup successfully, the section will become empty. You may now then click the "Exit Wizard" button.</strong>
          </div>
          <div>
            <img src="./assets/setup/3.png">
          </div>
        </div>
        <div>
          <div>
            <strong>You can now start creating tunnels for your agent.</strong>
          </div>
          <div>
            <button @click.prevent="createTunnel">Create Tunnel</button>
          </div>
        </div>
      </div>
    </form>
    <div v-else>
      <div>
        <span class="status-dot"></span> playit agent is currently running...
      </div>
      <div>
        <button @click.prevent="goPlayIt">Go to Playit.gg</button>
      </div>
    </div>
    <div class="credits">
        <a href="https://github.com/WisdomSky/playit-docker-web" title="github.com/WisdomSky/playit-docker-web">
          <img src="https://raw.githubusercontent.com/rdimascio/icons/master/icons/github.svg" style="height: 20px;">
        </a>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref, reactive, onBeforeMount, watch} from 'vue'

  const endpoint = "";

  const config = reactive<{secret: string}>({secret: ''});
  const hasSecret = ref<boolean>(false);

  const secret = ref<string>('');

  const step = ref<number>(1);
  const processing = ref<boolean>(false);

  onBeforeMount(async() => await init());

  watch(secret, () => {
    const match = secret.value.match(/^.*SECRET_KEY=([^\s]+).*$/);
    if (match) {
      secret.value = match[1];
    }
  })


  function goPlayIt() {
    window.open('https://playit.gg/account/agents', '_blank');
  }

  function startPlayIt() {
    processing.value = true;
    fetch(endpoint + '/start', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secret.value
      })
    })

    step.value = 3;
  }

  function getPlayItSecretKey() {
    window.open('https://playit.gg/account/setup/wizard/new-account/docker/docker-name', '_blank');
    step.value = 2;
  }


  function createTunnel() {
    window.open('https://playit.gg/account/setup/new-tunnel', '_blank');
    window.location.reload();
  }


  async function init() {

    const json = await (await fetch(endpoint + '/config')).json();

    config.secret = json.secret;
    secret.value = config.secret;
    hasSecret.value = config.secret !== undefined && config.secret.trim().length > 0;

  }

</script>


<style scoped lang="scss">
  .playit-logo {
    height: 100px;
  }

  input[type=text] {
    width: 50vw;
    max-width: 500px;
    min-width: 300px;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
    font-size: 1.25em;
  }

  h4 {
   margin: 0;
   color: #FF8B00;
  }

  button {
    margin-top: 20px;
    background-color: #c98816;
    outline: none;
    border: 2px solid #f1c577;
    padding: 10px 50px;
    font-size: 1.25em;
    color: #fff;

    &:hover {
      opacity: 0.75;
    }

    &:active {
      opacity: 1 !important;
      box-shadow: 0 0 15px 0 #dbb378a0;

    }

  }

  .new-version {
    max-width: 500px;
    margin-top: 10px;
    background: rgba(255,255,0,0.1);
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
  }

  .credits {
    margin-top: 20px;
    text-align: center;
  }

  .tip {
    position: absolute;
    top: 10px;
    left: 10px;
    max-width: 500px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
    text-align: left;
    box-shadow: 0 5px 10px 5px rgba(0,0,0,0.2);

    h5 {
      margin: 0;
      color: #FF8B00;
    }

    button {
      padding: 5px 10px;
      font-size: 0.65em;
    }

    label {
      vertical-align: center;
      font-size: 0.65em;
      input {
        vertical-align: middle;
      }
    }

  }

  .step-2, .step-3 {
    margin-top: 15px;
    text-align: left;

    & > div {
      margin-top: 10px;
    }

    img {
      width: 100%;
    }
  }

  .version {
    position: absolute;
    top: 0;
    right: 10px;
  }

  .status-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #2ecc40;
    border-radius: 50%;
    vertical-align: middle;
    animation: blink 1.5s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }

</style>
