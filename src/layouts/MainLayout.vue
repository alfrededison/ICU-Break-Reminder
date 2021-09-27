<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-toolbar>
      <div class="q-px-md q-mb-md">
        <div class="text-h3">{{ $t('title') }}</div>
        <div class="text-subtitle1">{{ this.todayDate }}</div>
      </div>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="600"
      :width="250"
      show-if-above
    >
      <q-img class="absolute-top" src="logo.png" style="border-right: 1px solid #ddd"/>
      <q-scroll-area style="height: calc(100% - 250px); margin-top: 250px; border-right: 1px solid #ddd">
        <Menu/>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import {date} from 'quasar';
import Menu from 'components/Menu';

export default {
  name: 'HomeLayout',
  data() {
    return {
      leftDrawerOpen: false,
    };
  },
  components: {
    Menu,
  },
  computed: {
    todayDate() {
      this.$q.lang; // a hack for force rerender component when quasar lang pack changed
      let timestamp = Date.now();
      return date.formatDate(timestamp, 'dddd, D MMMM YYYY');
    }
  },
};
</script>
