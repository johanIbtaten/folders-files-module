<template>
  <div :class="{ 'frame-loading': loading }">
    {{folders}}
    <Folder
      :folders="folders"
      :allCampaigns="true"
      :unclassifiedCampaigns="true"
    >
      <template v-slot:link>
        <button class="btn btn-link">
          {{ __('Statistique du dossier') }}
          <i class="fas fa-chart-bar"></i>
        </button>
      </template>

      <template v-slot:content>
        <div v-for="(status, index) in statusList" :key="index">
          <h3>{{ status }}</h3>

          <FileList :list="campaignWithStatus(status)">
            <template v-slot:filesheader>
              <!-- SENT -->
              <template v-if="status === 'sent'">
                <th>Nom</th>
                <th>Status</th>
                <th>Ouverture</th>
                <th>Id</th>
                <th>Action</th>
              </template>

              <!-- PLANNED -->
              <template v-if="status === 'planned'">
                <th>Nom</th>
                <th>Status</th>
                <th>Ouverture</th>
                <th>Action</th>
              </template>

              <!-- DRAFT -->
              <template v-if="status === 'draft'">
                <th>Nom</th>
                <th>Status</th>
                <th>Ouverture</th>
                <th>Id</th>
                <th>Id</th>
                <th>Action</th>
              </template>
            </template>

            <template v-slot:file="{ item }">
              <!-- SENT -->
              <template v-if="status === 'sent'">
                <td>{{ item.name }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.opened_count }}</td>
                <td>{{ item.id }}</td>
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
                <td>{{ item.name }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.opened_count }}</td>
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
                <td>{{ item.name }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.opened_count }}</td>
                <td>{{ item.id }}</td>
                <td>{{ item.id }}</td>
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
    </Folder>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import FileList from '../Folder/FolderContent/FileList';
import Folder from '../Folder/Folder';
import { deburr } from 'lodash';

export default {
  name: 'CampaignFolder',
  components: {
    FileList,
    Folder
  },
  data() {
    return {
      loading: false,
      searchItems: '',
      statusList: ['sent', 'planned', 'draft']
    };
  },
  computed: {
    ...mapState(['folders', 'items']),
    filteredItems() {
      return this.items.filter(item => {
        return deburr(item.name.toLowerCase()).match(
          deburr(this.searchItems.toLowerCase())
        );
      });
    }
  },
  methods: {
    campaignWithStatus(status) {
      return this.filteredItems.filter(item => {
        return item.status === status;
      });
    },
    handleSearch(val) {
      this.searchItems = val;
    },
    handleCreateFolder(val) {
      this.loading = true;
      this.$store.dispatch('createFolder', val).then(() => {
        this.loading = false;
      });
    },
    handleFolderMove(val) {
      // this.loading = true;
      this.$store.dispatch('updateFolderOrder', val).then(() => {
        // this.loading = false;
      });
    },
    handleFileDropped(val) {
      // this.loading = true;
      this.$store.dispatch('updateFolderContent', val).then(() => {
        // this.loading = false;
      });
    }
  },
  created() {
    this.$root.$on('files-search', this.handleSearch);
    this.$root.$on('create-folder', this.handleCreateFolder);
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
