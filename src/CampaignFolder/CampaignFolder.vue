<template>
  <div :class="{ 'frame-loading': loading }">
    <FolderMain
      :folders="folders"
      :files="items"
      :all="__('Toutes les campagnes')"
      :unclassified="__('Les campagnes non-classées')"
      :searchFilesPlaceholder="__('Rechercher dans les campagnes')"
    >
      <template v-slot:link>
        <a class="btn btn-link" href="#">
          {{ __('Statistique du dossier') }}
          <i class="fas fa-chart-bar"></i>
        </a>
      </template>

      <template v-slot:content="{ filteredFiles }">
        <div v-for="(status, index) in statusList" :key="index">
          <h3>{{ status }}</h3>

          <FileList :list="campaignWithStatus(filteredFiles, status)">
            <template v-slot:filesheader>
              <!-- SENT -->
              <template v-if="status === 'sent'">
                <th>Id</th>
                <th>Nom</th>
                <th>Destinataire</th>
                <th>Status</th>
                <th>Ouverture</th>
                <th>Action</th>
              </template>

              <!-- PLANNED -->
              <template v-if="status === 'planned'">
                <th>Id</th>
                <th>Nom</th>
                <th>Status</th>
                <th>Action</th>
              </template>

              <!-- DRAFT -->
              <template v-if="status === 'draft'">
                <th>Id</th>
                <th>Nom</th>
                <th>Status</th>
                <th>Ouverture</th>
                <th>Id</th>
                <th>Action</th>
              </template>
            </template>

            <template v-slot:file="{ file }">
              <!-- SENT -->
              <template v-if="status === 'sent'">
                <td>{{ file.id }}</td>
                <td>{{ file.name }}</td>
                <td>{{ file.name }}</td>
                <td>{{ file.status }}</td>
                <td>{{ file.opened_count }}</td>
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
              <template v-if="status === 'planned'">
                <td>{{ file.id }}</td>
                <td>{{ file.name }}</td>
                <td>{{ file.status }}</td>
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

              <!-- DRAFT -->
              <template v-if="status === 'draft'">
                <td>{{ file.id }}</td>
                <td>{{ file.name }}</td>
                <td>{{ file.status }}</td>
                <td>{{ file.opened_count }}</td>
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
            </template>
          </FileList>
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
      statusList: ['sent', 'planned', 'draft']
    };
  },
  computed: {
    ...mapState(['folders', 'items'])
  },
  methods: {
    campaignWithStatus(filteredFiles, status) {
      return filteredFiles.filter(file => {
        return file.status === status;
      });
    },
    handleCreateFolder(payload) {
      this.loading = true;
      this.$store.dispatch('createFolder', payload).then(() => {
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
      // this.$store.dispatch('updateFolderContent', payload).then(() => {});
    }
  },
  created() {
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
