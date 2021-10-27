<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <div class="q-px-md q-my-md">
        <div class="text-h3">{{ $t('title') }}</div>
      </div>
    </q-header>
    <q-page-container>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'PopupLayout',
};
</script>
