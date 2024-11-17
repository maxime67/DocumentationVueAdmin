<script setup>
</script>

<template>
  <nav class="block w-full px-4 py-2 mx-auto bg-white shadow-md lg:px-8 lg:py-3">
    <div class="flex flex-wrap items-center justify-between mx-auto text-slate-800">
      <RouterLink to="/">
      <a href="#" class="mr-4 block cursor-pointer py-1.5 text-base text-slate-800 font-semibold">
        <img class="w-28 rounded-md" :src="`../logo/LogoEasySetup.png`" />
      </a>
      </RouterLink>
      <router-link to="/add/documentation">
      <div class="hidden lg:block">
        <ul class="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
          <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
            <img class="w-6 rounded-md" :src="`../logo/add.png`" />
            <a href="#" class="flex items-center">New Documentation</a>
          </li>
        </ul>
      </div>
      </router-link>
    </div>
  </nav>
</template>
<style scoped>

</style>
