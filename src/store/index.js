import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      url: 'https://feeds.feedburner.com/zerohedge/feed',
      title: 'RTL Headlines',
      entries: []
    }
  },

  mutations: {
    entries(state, list) {
      if (list) {
        state.entries = [...list]
      }
    },
    url(state, url) {
      if (url) {
        state.url = url
      }
    },
    title(state, title) {
      if (title) {
        state.title = title
      }
    }
  },

  actions: {
    //
    // Load the saved data to store
    //
    init(context) {
      chrome.storage.local.get(['url', 'title', 'entries'], (result) => {
        console.log("Loaded: " + result.title)
        context.commit('url', result.url)
        context.commit('title', result.title)
        context.commit('entries', result.entries)
      })
    },

    persistArticles({ context, state }) {
      chrome.storage.local.set({ 'entries': [... state.entries] })
    }
  }
})
