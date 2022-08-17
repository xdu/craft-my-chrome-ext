<template>
    <article v-show="errorMessage" class="message is-danger is-small" @click="clear()">
      <div class="message-header">
        <p>Fetch error: </p>
        <button class="delete is-small" aria-label="delete"></button>
      </div>
      <div class="message-body">
        {{ errorMessage }}
      </div>
    </article>
  <div class="main_app container">
    <router-view></router-view>
  </div>
</template>

<script>
import "bulma/css/bulma.min.css";
import "font-awesome/css/font-awesome.min.css";
import { mapActions } from "vuex";

export default {

  data() {
    return {
      errorMessage: ''
    }
  },

  methods: {
    ...mapActions(["init"]),

    clear() {
      this.errorMessage = ''
    }
  },

  created() {
    this.init();
    const self = this

    chrome.runtime.onMessage.addListener(function (request) {
      if (request.action === "error") {
        self.errorMessage = request.message
      }
      // no asynchronous sendReponse
    });
  },
};
</script>

<style>
.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
