<template>
  <div>
    <div>
      <img src="./assets/playit-logo.png" class="playit-logo" alt="Playit.gg">
    </div>
    <form id="cf-form" method="post" @submit.prevent>
      <div v-if="claim.length">
        <div>
          <h4>Playit.gg Claim URL:</h4>
        </div>
        <input type="text" name="token" style="text-align: center" v-model="claim" readonly>
      </div>
      <div>
        <button @click.prevent="goPlayIt">{{ claim.trim().length ? 'Claim' : 'Go to Playit.gg'}}</button>
      </div>
    </form>
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

  const config = reactive<{claim: string}>({claim: ''});

  const claim = ref<string>('');

  const empty = ref<boolean>(true);

  onBeforeMount(async() => await init());

  function goPlayIt() {
    window.location.href = claim.value.trim().length ? claim.value : 'https://playit.gg/account/agents';
  }

  watch(claim, () => {
    console.log('claim updated: ', claim.value)
  })

  async function init() {

    const json = await (await fetch(endpoint + '/config')).json();

    config.claim = json.claim;
    empty.value = config.claim === undefined || config.claim.trim().length === 0;
    claim.value = config.claim;

    setTimeout(init, 5000);
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

  .version {
    position: absolute;
    top: 0;
    right: 10px;
  }

</style>
