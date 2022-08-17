<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ content.title }}
      </p>
    </header>
    <div class="card-content">
      <div class="block">
      <time class="is-size-7">{{ dayjs(content.date) }}</time>
      </div>
      <div class="content" v-html="content.summary"></div>
    </div>
    <div class="card-footer">
      <p class="card-footer-item">
        <a href="#" @click="back()" class="is-size-7">
          <span class="icon">
            <i class="fa fa-arrow-left"></i>
          </span>
          Back to List
        </a>
      </p>
      <p class="card-footer-item is-size-6">
        <a v-bind:href="content.link" target="_blank" class="is-size-7">
          <span class="icon">
            <i class="fa fa-globe"></i>
          </span>
          View in Browser
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import dayjs from "dayjs";

export default {
  name: "ArticleView",

  data() {
    return {
      index: 0,
      dayjs: dayjs,
    };
  },

  mounted() {
    window.addEventListener("keydown", this.keypress);

    this.index = this.entries.findIndex(
      (entry) => entry.id === this.$route.params.id
    );
    this.entries[this.index].read = true;
  },

  unmounted() {
    window.removeEventListener("keydown", this.keypress);
    this.persistArticles()
  },

  computed: {
    ...mapState({
      entries: (state) => state.entries,
    }),

    content() {
      return this.entries[this.index];
    },

    displayDate() {
      return dayjs(this.content.date);
    },
  },

  methods: {
    ... mapActions([ "persistArticles" ]),

    next() {
      if (this.index < this.entries.length - 1) {
        this.index++;
        this.entries[this.index].read = true;
      }
    },

    prev() {
      if (this.index > 0) {
        this.index--;
        this.entries[this.index].read = true;
      }
    },

    back() {
      this.$router.back();
    },

    keypress(e) {
      // if (e.defaultPrevented) {
      //   return; // Should do nothing if the default action has been cancelled
      // }
      if (e.code === "ArrowLeft") {
        this.back();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        this.next();
        window.scrollTo({ top: 0 });
      } else if (e.code == "ArrowUp") {
        e.preventDefault();
        this.prev();
        window.scrollTo({ top: 0 });
      }
    },
  },
};
</script>