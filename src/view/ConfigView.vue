<template>
  <div class="box">
    <div class="field">
      <div class="label">Feed URL</div>
      <div class="control">
        <input class="input" type="text" :value="url" @input="changeURL" placeholder="https://" />
      </div>
      <p class="help">RSS or Atom Feed URL</p>
    </div>
    <div class="control buttons">
      <button class="button is-success is-small" @click="commit()">OK</button>
      <button class="button is-info is-small" @click="this.$router.back()">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: "ConfigView",

  data() {
    return {
      feedURL: ''
    };
  },

  computed: {
    ...mapState([ 'url' ])
  },

  methods: {
    ...mapMutations({ 
      setEntries: 'entries', 
      setURL: 'url', 
      setTitle: 'title'
    }),

    changeURL(e) {
      this.feedURL = e.target.value
    },

    commit() {
      chrome.runtime.sendMessage(
        { action: "fetch", url: this.feedURL },
        (response) => {
          if (response && response.url) {
            this.setURL(response.url)
            this.setTitle(response.title)
            this.setEntries(response.entries)
          }
        }
      );
      this.$router.back()
    },
  },
}
</script>
