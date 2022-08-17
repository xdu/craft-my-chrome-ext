<template>
  <div class="box">
    <div class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <button class="button is-small" @click="refresh()">
            <span class="icon">
              <i class="fa fa-refresh"></i>
            </span>
          </button>
        </div>
        <div class="level-item is-small">
          <div>
            <p class="title is-6" v-if="title < 21">{{ title }}</p>
            <p class="title is-6" v-else>
              {{ title.substring(0, 18) + " .." }}
            </p>
            <p class="is-size-7">{{ url }}</p>
          </div>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <button
            class="button is-small" @click="this.$router.push({ name: 'config' })">
            <span class="icon">
              <i class="fa fa-gear"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="content is-small">
    <article class="media" v-for="e in entries" :key="e.id">
      <div class="media-content">
        <div class="content">
          <router-link :to="{ name: 'article', params: { id: e.id } }">
            <p :style="{ 'font-weight': e.read ? 400 : 600 }">{{ e.title }}</p>
          </router-link>
          <p>
            <small>{{ dayjs(e.date).fromNow() }}</small>
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

export default {
  name: "FeedView",

  created() {
    dayjs.extend(relativeTime);
    this.dayjs = dayjs;
  },

  computed: {
    ...mapState({
      entries: (state) => state.entries,
      url: (state) => state.url,
      title: (state) => state.title,
    }),
  },

  methods: {
    ...mapMutations({ setEntries: "entries" }),

    refresh() {
      chrome.runtime.sendMessage(
        { action: "fetch", url: this.url },
        (response) => this.setEntries(response.entries)
      );
    },
  },
};
</script>
