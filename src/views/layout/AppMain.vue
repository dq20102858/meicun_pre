<template>
        <transition name="fade" mode="out-in">
                <router-view :key="key"></router-view>
        </transition>
</template>
<script>
    export default {
      provide() {
         return {
             reload: this.reload
         }
      },
      data () {
          return {
          }
      },
      computed: {
        key() {
            return this.$route.fullPath
        }
    },
      methods: {
      }
    };
</script>
