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
    // On met à jour les folders
    folders(state, payload) {
      state.folders = payload;
    },
    items(state, payload) {
      state.items = payload;
    },
    add_folder(state, folder) {
      // On ajoute un objet folder début du tableau des folders
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

    // On debounce pour éviter de créer plusieurs folder
    createFolder: debounce(
      // Fonction async car elle fait un appel asynchrone
      // elle retourne une prommesse
      async ({ commit }, name) => {
        return Backend.createFolder(name).then(response => {
          // Si la création du folder dans la bdd s'est bien déroulée
          if (response.success) {
            // On commmit une mutation du store add_folder
            //  avec le folder vide retourné par la bdd
            commit('add_folder', response.message.folder);
            // On affiche un toast de succès
            window.app.ui.success();
            // On retourne une promesse resolue
            return Promise.resolve();
          } else {
            // Si erreur dans la bdd on affiche un toast d'erreur avec le message
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
            /* 
            Si l'id du folder cible correspond au folder id récupéré dans le payload
            et que le folder cible est différent du folder courant (pour éviter de faire un uopdate de lui-même)
            et que le folder cible n'est pas le folder unclassified
            */
            if (
              folder.id === toFolder.id &&
              toFolder !== selectedFolder.id &&
              toFolder.name !== 'unclassified'
            ) {
              // Si le folder cible ne contient pas l'id du file que l'on a drop
              if (!folder.items.includes(fileId)) {
                // Alors on ajoute l'id du file à son tableau des items
                folder.items.push(fileId);
              }
              // Pour tous les autres folder
            } else {
              // si il contient l'id du file que l'on a déplacé
              if (folder.items.includes(fileId)) {
                // On le supprime de son tableau des items
                folder.items.splice(folder.items.indexOf(fileId), 1);
              }
            }
            // Si le folder est le folder unclassified
            if (toFolder.name === 'unclassified') {
              // Si il contient le file qui vient d'être classé
              if (folder.items.includes(fileId)) {
                // alors que on le supprime de son tableau des items
                folder.items.splice(folder.items.indexOf(fileId), 1);
              }
            }
            // On retourne le folder mise à jour ou non
            return folder;
          });

          commit('folders', payload);
          // On force la mise à jour des items
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
