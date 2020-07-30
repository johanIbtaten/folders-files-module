import Vue from 'vue';
import Vuex from 'vuex';

import Backend from './Backend';
import CampaignFolder from './CampaignFolder/CampaignFolder';

import { debounce } from 'lodash';

import './crm_stuff';

Vue.use(Vuex);

/* On ajoute une mixin pour ajouter la fonction de simulation
d'internationalisation sur tous les composants */
Vue.mixin({
  methods: {
    __(string) {
      return string;
    }
  }
});

Vue.config.productionTip = false;

// On déclare un filtre qui permet de formater la date en français
Vue.filter('formatDate', function(value) {
  if (value) {
    let dateFormated = new Date(value);
    const options = {
      //weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return dateFormated.toLocaleDateString('fr-FR', options);
  }
});

// On initialise un store
let store = getStore();

// Instance de vue //
// On crée une instance de vue avec le smart component CampaignFolder
new Vue({
  store,
  render: h => h(CampaignFolder)
}).$mount('#app');

// On appel l'action load pour initialiser le store
store.dispatch('load');

// Store //
// On déclare le store
function getStore() {
  // On déclare le state
  let state = {
    // Tableau des folders
    folders: [],
    // Tableau des campagnes
    items: [],
    loading: {
      createFolder: false,
      el: null
    }
  };

  // On déclare les getters
  let getters = {
    getUnclassified(state) {
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
      return res;
    }
  };

  // On déclare les mutations
  let mutations = {
    folders(state, payload) {
      state.folders = payload;
    },
    items(state, payload) {
      state.items = payload;
    },
    add_folder(state, folder) {
      state.folders.splice(1, 0, folder);
    },
    delete_folder(state, folderId) {
      state.folders.splice(
        state.folders.findIndex(folder => {
          return folder.id === folderId;
        }),
        1
      );
    }
  };

  // On déclare les actions
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
          commit('items', [...state.items]);
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
    }
  };

  // On instancie notre store
  return new Vuex.Store({
    state,
    getters,
    mutations,
    actions
  });
}
