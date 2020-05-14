import Vue from 'vue';
import Vuex from 'vuex';

import Backend from './Backend';
import CampaignFolder from './CampaignFolder/CampaignFolder';

// import Loader from './Loader';
// Vue.component('Loader', Loader);

import { debounce } from 'lodash';

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
  render: h => h(CampaignFolder)
}).$mount('#app');

store.dispatch('load');

// Store //
function getStore() {
  let state = {
    folders: [],
    items: [],
    loading: {
      createFolder: false,
      // delSnippet: false,
      // addCategory: false,
      // delCategory: false,
      // updateCategory: false,
      // createSnippet: false,
      el: null
    }
  };

  let mutations = {
    folders(state, payload) {
      console.log('mutPayload', payload);
      state.folders = payload;
    },
    items(state, payload) {
      state.items = payload;
    },
    add_folder(state, folder) {
      state.folders.unshift(folder);
    }
    // languages(state, payload) {
    //   state.languages = payload;
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
    },
    createFolder: debounce(
      async ({ commit }, name) => {
        return Backend.createFolder(name).then(response => {
          if (response.success) {
            commit('add_folder', response.message.folder);
            window.app.ui.success();
            return Promise.resolve();
          } else {
            window.app.ui.error(response.message);
          }
        });
      },
      300,
      { leading: true }
    ),
    async updateFolderOrder({ commit }, payload) {
      return Backend.saveFoldersPosition(payload).then(response => {
        if (response.success) {
          commit('folders', payload);
          window.app.ui.success();
          return Promise.resolve();
        } else {
          window.app.ui.error(response.message);
        }
      });
    },

    async updateFolderContent(
      { state, commit },
      { contentIds, selectedFolder }
    ) {
      return Backend.updateFolderContent({ contentIds, selectedFolder }).then(
        response => {
          if (response.success) {
            let payload = state.folders.map(folder => {
              if (folder.id === contentIds.folderId) {
                if (!folder.items.includes(contentIds.fileId)) {
                  folder.items.push(contentIds.fileId);
                }
              }
              if (
                selectedFolder &&
                folder.id === selectedFolder.id &&
                contentIds.folderId !== selectedFolder.id
              ) {
                if (folder.items.includes(contentIds.fileId)) {
                  folder.items.splice(
                    folder.items.indexOf(contentIds.fileId),
                    1
                  );
                }
              }
              return folder;
            });

            commit('folders', payload);
            window.app.ui.success();
            return Promise.resolve();
          } else {
            window.app.ui.error(response.message);
          }
        }
      );
    }

    // createFolder({ commit }, name) {
    //   return Backend.createFolder(name).then(response => {
    //     if (response.success) {
    //       commit('add_folder', response.message.folder);
    //       window.app.ui.success();
    //       return Promise.resolve();
    //     } else {
    //       window.app.ui.error(response.message);
    //     }
    //   });
    // }

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
