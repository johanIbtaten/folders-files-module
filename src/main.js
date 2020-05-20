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

  let getters = {
    getUnclassified(state) {
      //return state.itesm.find(event => event.id === id);
      let res = [];
      res = state.items.filter(file => {
        let isClassified = false;
        state.folders.map(folder => {
          if (folder.items.includes(file.id)) {
            isClassified = true;
          }
        });
        return !isClassified;
      });
      console.log('res', res);
      return res;
    }
  };

  let mutations = {
    folders(state, payload) {
      state.folders = payload;
    },
    items(state, payload) {
      state.items = payload;
    },
    add_folder(state, folder) {
      state.folders.splice(1, 0, folder);
      //state.folders.unshift(folder);
    },
    delete_folder(state, folderId) {
      state.folders.splice(
        state.folders.findIndex(folder => {
          return folder.id === folderId;
        }),
        1
      );
    }
    // languages(state, payload) {
    //   state.languages = payload;
    // },
    // add_snippet(state, snippet) {
    //   state.snippets.push(snippet);
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
      1000,
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
      { toFolder, fileId, selectedFolder }
    ) {
      return Backend.updateFolderContent({
        toFolderId: toFolder.id,
        fileId
      }).then(response => {
        if (response.success) {
          let payload = state.folders.map(folder => {
            if (
              folder.id === toFolder.id &&
              toFolder !== selectedFolder.id &&
              toFolder.name !== 'unclassified'
            ) {
              if (!folder.items.includes(fileId)) {
                folder.items.push(fileId);
              }
            } else {
              if (folder.items.includes(fileId)) {
                folder.items.splice(folder.items.indexOf(fileId), 1);
              }
            }

            if (toFolder.name === 'unclassified') {
              if (folder.items.includes(fileId)) {
                folder.items.splice(folder.items.indexOf(fileId), 1);
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
      });
    },

    async renameFolder({ state, commit }, folderUpdated) {
      return Backend.renameFolder(folderUpdated).then(response => {
        if (response.success) {
          let payload = state.folders.map(folder => {
            if (folder.id === folderUpdated.id) {
              folder.name = folderUpdated.name;
            }
            return folder;
          });
          commit('folders', payload);
          window.app.ui.success();
          return Promise.resolve();
        } else {
          window.app.ui.error(response.message);
        }
      });
    },

    async deleteFolder({ commit }, folderId) {
      return Backend.deleteFolder(folderId).then(response => {
        if (response.success) {
          commit('delete_folder', folderId);
          window.app.ui.success();
          return Promise.resolve();
        } else {
          window.app.ui.error(response.message);
        }
      });
    },

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
    getters,
    mutations,
    actions
  });
}
