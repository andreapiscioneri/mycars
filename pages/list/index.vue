<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

// Set SEO meta tags
useHead({
  title: t('listIndex.title'),
  meta: [
    { name: 'description', content: t('listIndex.description') },
    { name: 'keywords', content: t('listIndex.keywords') },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: t('listIndex.title') },
    { property: 'og:description', content: t('listIndex.description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/list' },
  ],
  link: [
    { rel: 'canonical', href: 'https://www.mycarsbergamo.it/list' }
  ]
});

onMounted(() => {
  // Redirect to used cars by default
  router.push('/list/used');
});
</script>

<template>
  <div class="container mx-auto p-4">
    <p>{{ t('listIndex.redirecting') }}</p>
  </div>
</template>