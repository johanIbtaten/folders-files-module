<template>
  <!-- On ajoute la classe frame-loading si la variables est à loading à true -->
  <div :class="{ 'frame-loading': loading }">
    <!-- On charge notre dumb component qui prend en props des folders, des files à classer
    et les props pour personnaliser l'affichage
    -->
    <FolderMain
      :folders="folders"
      :files="items"
      :all="__('Toutes les campagnes')"
      :unclassified="__('Les campagnes non-classées')"
      :searchFilesPlaceholder="__('Rechercher dans les campagnes')"
    >
      <!-- On créer un slot link pour personnaliser le lien -->
      <template v-slot:link>
        <a class="btn btn-link" href="#">
          {{ __('Statistique du dossier') }}
          <i class="fas fa-chart-bar"></i>
        </a>
      </template>

      <!-- On crée un scoped slot content qui récupère en prop de slot les files filtrés et le dossier sélectionné -->
      <template v-slot:content="{ filteredFiles, selectedFolder }">
        <!-- On boucle sur la liste des status des files -->
        <div v-for="(statusItem, index) in statusList" :key="index">
          <!-- On affiche le titre du status -->
          <h3>{{ statusItem.title }}</h3>
          <!-- On affiche un composant qui liste des files, on lui passe en props
          les fichiers filtrés avec le bon status et le dossier selectionné
          -->
          <FileList
            :list="campaignWithStatus(filteredFiles, statusItem.status)"
            :selectedFolder="selectedFolder"
          >
            <!-- On crée un slot filesheader qui correspond au header du tableau des files -->
            <template v-slot:filesheader>
              <!-- Si c'est le status draft on insère ce header personnalisé dans le slot -->
              <!-- DRAFT -->
              <template v-if="statusItem.status === 'draft'">
                <th>Nom</th>
                <th>Status</th>
                <th>Ouverture</th>
                <th>Action</th>
                <th>Id</th>
                <th>Id</th>
              </template>

              <!-- SENT -->
              <template v-if="statusItem.status === 'sent'">
                <th>Nom</th>
                <th>Destinataire</th>
                <th>Status</th>
                <th>Ouverture</th>
                <th>Action</th>
                <th>Id</th>
              </template>

              <!-- PLANNED -->
              <template v-if="statusItem.status === 'planned'">
                <th>Nom</th>
                <th>Status</th>
                <th>Action</th>
                <th>Id</th>
              </template>
            </template>

            <!-- On crée un scoped slot file qui récupère un file en prop de slot -->
            <template v-slot:file="{ file }">
              <!-- Si c'est le status draft on affiche cette structure personnalisée de tableau -->
              <!-- DRAFT -->
              <template v-if="statusItem.status === 'draft'">
                <td>
                  <!-- On récupère et on affiche la proprété name du file -->
                  <strong>{{ file.name }}</strong>
                </td>
                <td>{{ file.status }}</td>
                <td>{{ file.opened_count | formatDate }}</td>
                <td>{{ file.id }}</td>
                <td>{{ file.id }}</td>
                <!-- On affiche des boutons personnalisés -->
                <td>
                  <div class="ml-auto btn-container">
                    <div class="btn-group">
                      <button class="btn btn-secondary mr-1">
                        <i class="fas fa-ellipsis-h"></i>
                      </button>
                      <button class="btn btn-secondary">
                        {{ __('modifier') }}
                        <i class="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </template>

              <!-- SENT -->
              <template v-if="statusItem.status === 'sent'">
                <td>
                  <strong>{{ file.name }}</strong>
                </td>
                <td>{{ file.sending_list[0].total_customer }}</td>
                <td>{{ file.status }}</td>
                <td>{{ file.opened_count | formatDate }}</td>
                <td>{{ file.id }}</td>
                <td>
                  <div class="ml-auto btn-container">
                    <div class="btn-group">
                      <button class="btn btn-secondary mr-1">
                        <i class="fas fa-ellipsis-h"></i>
                      </button>
                      <button class="btn btn-secondary">
                        {{ __('modifier') }}
                        <i class="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </template>

              <!-- PLANNED -->
              <template v-if="statusItem.status === 'planned'">
                <td>
                  <strong>{{ file.name }}</strong>
                </td>
                <td>{{ file.status }}</td>
                <td>{{ file.id }}</td>
                <td>
                  <div class="ml-auto btn-container">
                    <div class="btn-group">
                      <button class="btn btn-secondary mr-1">
                        <i class="fas fa-ellipsis-h"></i>
                      </button>
                      <button class="btn btn-secondary">
                        {{ __('rapport') }}
                        <i class="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </template>
            </template>
          </FileList>
          <!-- </template> -->
        </div>
      </template>
    </FolderMain>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import FileList from '../Folder/FolderContent/FileList';
import FolderMain from '../Folder/FolderMain';

export default {
  name: 'CampaignFolder',
  components: {
    FileList,
    FolderMain
  },
  data() {
    return {
      loading: false,
      // On déclare une liste de status pour les files
      statusList: [
        { status: 'draft', title: this.__('En préparation') },
        { status: 'sent', title: this.__('Envoyé') },
        { status: 'planned', title: this.__('Planifié') }
      ]
    };
  },
  computed: {
    // On importe les tableaux des folders et des items depuis le store
    ...mapState(['folders', 'items'])
  },
  methods: {
    // Méthode qui retourne les fichiers filtrés qui ont pour status
    // le status passé en paramètre
    campaignWithStatus(filteredFiles, status) {
      return filteredFiles.filter(file => {
        return file.status === status;
      });
    },
    handleCreateFolder(payload) {
      // On démarre le loading
      this.loading = true;
      // On dispatch l'action createFolder en passant le payload de l'event
      this.$store.dispatch('createFolder', payload).then(() => {
        // Quand la promesse est résolue on arrête le loading
        this.loading = false;
      });
    },
    handleRenameFolder(payload) {
      this.loading = true;
      this.$store.dispatch('renameFolder', payload).then(() => {
        this.loading = false;
      });
    },
    handleDeleteFolder(payload) {
      this.loading = true;
      this.$store.dispatch('deleteFolder', payload).then(() => {
        this.loading = false;
      });
    },
    handleFolderMove(payload) {
      this.$store.dispatch('updateFolderOrder', payload).then(() => {});
    },
    handleFileDropped(payload) {
      this.loading = true;
      this.$store.dispatch('updateFolderContent', payload).then(() => {
        this.loading = false;
      });
    }
  },
  created() {
    // Quand un event create-folder est emit on appelle la method handleCreateFolder
    this.$root.$on('create-folder', this.handleCreateFolder);
    this.$root.$on('rename-folder', this.handleRenameFolder);
    this.$root.$on('delete-folder', this.handleDeleteFolder);
    this.$root.$on('folder-move', this.handleFolderMove);
    this.$root.$on('file-dropped', this.handleFileDropped);
  }
};
</script>

<style scoped lang="scss">
/deep/ a:hover {
  text-decoration: none;
}
</style>
