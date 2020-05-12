<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-3">
        <ElementsList :folders="folders"></ElementsList>
      </div>
      <div class="col-9">
        <FolderContent @items-search="handleSearch" :inputSearch="searchItems">
          <template v-slot:link>
            <button class="btn btn-link">
              {{ __('Statistique du dossier') }}
              <i class="fas fa-chart-bar"></i>
            </button>
          </template>

          <template v-slot:default>
            <!-- <div v-if="draft"> -->
            <h4>En préparation</h4>
            <CampaignCategoryListing :list="draftCampaigns">
              <template v-slot:folderfile-header>
                <th>Nom</th>
                <th>Status</th>
                <th>Ouverture</th>
                <th>Id</th>
                <th>Action</th>
              </template>
              <template v-slot:folderfile="{ item }">
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
            </CampaignCategoryListing>
            <!-- </div> -->

            <!-- <div v-if="sent"> -->
            <h4>Envoyé</h4>
            <CampaignCategoryListing :list="sentCampaigns">
              <template v-slot:folderfile-header>
                <th>Nom</th>
                <th>Status</th>
                <th>Ouverture</th>
                <th>Action</th>
              </template>
              <template v-slot:folderfile="{ item }">
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
            </CampaignCategoryListing>
            <!-- </div> -->
          </template>
        </FolderContent>
      </div>
    </div>
  </div>
</template>

<script>
// import "../crm_stuff";
// import draggable from 'vuedraggable'
import { deburr } from 'lodash';

import { mapState } from 'vuex';
import ElementsList from './ElementsList';
import FolderContent from './FolderContent';
import CampaignCategoryListing from './CampaignCategoryListing';

export default {
  name: 'Directory',
  // props: ['snippet'],
  components: {
    ElementsList,
    CampaignCategoryListing,
    FolderContent
  },
  data() {
    return {
      searchItems: ''
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
    },
    sentCampaigns() {
      return this.filteredItems.filter(item => {
        return item.status === 'sent';
      });
    },
    draftCampaigns() {
      return this.filteredItems.filter(item => {
        return item.status === 'draft';
      });
    }
  },
  methods: {
    handleSearch(val) {
      this.searchItems = val;
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ a:hover {
  text-decoration: none;
}
</style>
