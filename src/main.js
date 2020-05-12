import Vue from 'vue';
import Vuex from 'vuex';

import Backend from './Backend';
import Directory from './Directory/Directory';

import './crm_stuff';

Vue.use(Vuex);

Vue.mixin({
  methods: {
    __(string) {
      return string;
    }
  }
});

Vue.config.productionTip = false;

let store = getStore();

// Instance de vue //
new Vue({
  store,
  render: h => h(Directory)
}).$mount('#app');

store.dispatch('load');

// Store //
function getStore() {
  let state = {
    folders: [],
    items: []
    // loading: {
    //   saveSnippet: false,
    //   delSnippet: false,
    //   addCategory: false,
    //   delCategory: false,
    //   updateCategory: false,
    //   createSnippet: false,
    //   el: null
    // }
  };

  let mutations = {
    folders(state, payload) {
      state.folders = payload;
    },
    items(state, payload) {
      state.items = payload;
    }
    // languages(state, payload) {
    //   state.languages = payload;
    // },
    // add_category(state, category) {
    //   state.categories.unshift(category);
    // },
    // add_snippet(state, snippet) {
    //   state.snippets.push(snippet);
    // },
    // delete_category(state, categoryId) {
    //   state.categories.splice(
    //     state.categories.findIndex(category => {
    //       return category.id === categoryId;
    //     }),
    //     1
    //   );
    // },
    // delete_snippet(state, snippetId) {
    //   state.snippets.splice(
    //     state.snippets.findIndex(snippet => {
    //       return snippet.id === snippetId;
    //     }),
    //     1
    //   );
    // },
    // loading(state, { event, isLoading, el }) {
    //   state.loading[event] = isLoading;
    //   state.loading['el'] = el ? el : null;
    // }
  };

  let actions = {
    async load({ commit }) {
      return Backend.load().then(response => {
        commit('folders', response.message.folders);
        commit('items', response.message.items);
      });
    }

    // async updateCategoryOrder({ commit }, payload) {
    //   return Backend.saveCategoriesPosition(payload).then(response => {
    //     if (response.success) {
    //       commit('categories', payload);
    //       window.app.ui.success();
    //       return Promise.resolve();
    //     } else {
    //       window.app.ui.error(response.message);
    //     }
    //   });
    // },

    // async addCategory({ commit }, name) {
    //   return Backend.addCategory(name).then(response => {
    //     if (response.success) {
    //       commit('add_category', response.message.category);
    //       window.app.ui.success();
    //       return Promise.resolve();
    //     } else {
    //       window.app.ui.error(response.message);
    //     }
    //   });
    // },

    // async deleteCategory({ commit }, categoryId) {
    //   return Backend.deleteCategory(categoryId).then(response => {
    //     if (response.success) {
    //       commit('delete_category', categoryId);
    //       window.app.ui.success();
    //       return Promise.resolve();
    //     } else {
    //       window.app.ui.error(response.message);
    //     }
    //   });
    // },

    // async updateCategory({ state, commit }, categoryUpdated) {
    //   return Backend.updateCategory(categoryUpdated).then(response => {
    //     if (response.success) {
    //       let payload = state.categories.map(category => {
    //         if (category.id === categoryUpdated.id) {
    //           category.name = categoryUpdated.name;
    //         }
    //         return category;
    //       });
    //       commit('categories', payload);
    //       window.app.ui.success();
    //       return Promise.resolve();
    //     } else {
    //       window.app.ui.error(response.message);
    //     }
    //   });
    // },

    // /* On debounce cette action pour éviter un double appel quand
    // on déplace un snippet d'une catégorie à une autre */
    // debounceUpdateSnippetsOrder: debounce(
    //   ({ state, commit }, snippetsUpdated) => {
    //     let payload = state.snippets.map(snippet => {
    //       let snippetUpdated = snippetsUpdated.find(
    //         snipUp => snipUp.id === snippet.id
    //       );
    //       if (snippetUpdated) {
    //         snippet = snippetUpdated;
    //       }
    //       return snippet;
    //     });
    //     Backend.saveSnippetsPosition(payload).then(response => {
    //       if (response.success) {
    //         commit('snippets', payload);
    //         window.app.ui.success();
    //       } else {
    //         window.app.ui.error(response.message);
    //       }
    //     });
    //   },
    //   100
    // ),

    // async saveSnippet({ state, commit }, { snippetToSave, create }) {
    //   return Backend.saveSnippet(snippetToSave).then(response => {
    //     if (response.success) {
    //       if (create) {
    //         commit('add_snippet', snippetToSave);
    //       } else {
    //         let payload = state.snippets.map(snippet => {
    //           if (snippet.id === snippetToSave.id) {
    //             snippet.title = snippetToSave.title;
    //             snippet.contents = snippetToSave.contents;
    //           }
    //           return snippet;
    //         });
    //         commit('snippets', payload);
    //       }
    //       window.app.ui.success();
    //       return Promise.resolve();
    //     } else {
    //       window.app.ui.error(response.message);
    //     }
    //   });
    // },

    // async getEmptySnippet() {
    //   return Backend.getEmptySnippet().then(response => {
    //     if (response.success) {
    //       window.app.ui.success();
    //       return Promise.resolve(response);
    //     } else {
    //       window.app.ui.error(response.message);
    //     }
    //   });
    // },

    // async deleteSnippet({ commit }, snippetId) {
    //   return Backend.deleteSnippet(snippetId).then(response => {
    //     if (response.success) {
    //       commit('delete_snippet', snippetId);
    //       window.app.ui.success();
    //       return Promise.resolve();
    //     } else {
    //       window.app.ui.error(response.message);
    //     }
    //   });
    // },

    // loading({ commit }, payload) {
    //   commit('loading', payload);
    // }
  };

  return new Vuex.Store({
    state,
    mutations,
    actions
  });
}
