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
      <div class="q-px-lg q-pt-xl q-mb-md">
        <div class="text-h3">{{ $t('title') }}</div>
        <div class="text-subtitle1">{{ this.todayDate }}</div>
      </div>
      <q-img class="IM__header-image absolute-top" src="~assets/images/cover.jpg"/>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="600"
      :width="250"
      show-if-above
    >
      <q-scroll-area style="height: calc(100% - 192px); margin-top: 192px; border-right: 1px solid #ddd">
        <Menu/>
      </q-scroll-area>

      <q-img class="absolute-top" src="~assets/images/cover.jpg" style="height: 192px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar class="q-mb-sm" size="56px">
            <q-img class="IM__menu-avatar" src="~assets/icon.png"/>
          </q-avatar>
          <div class="text-weight-bold IM__text-shadowed">{{ $t('defaults.admin') }}</div>
          <div class="IM__text-shadowed">@admin</div>
        </div>
      </q-img>
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

<style lang="scss">
.IM {
  &__header-image {
    height: 100%;
    z-index: -1;
    opacity: 0.2;
    filter: grayscale(100%)
  }

  &__menu-avatar {
    background-color: $primary;
  }

  &__text-shadowed {
    text-shadow: 0 0 5px $primary, 0 0 7px $accent;
  }
}
</style>
