<template>
  <div class="wrapper">
    <div>
      <ChangePassword />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ChangePassword from "../components/ChangePassword.vue";

@Component({
  components: {
    ChangePassword,
  },
})
export default class PasswordSettings extends Vue {
  redirectUser() {
    this.$router.push("/settings").catch(() => undefined);
  }
}
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  align-items: center;

  .title {
    margin: 0;
  }
}
.settings-container {
  background: #fff;
  border-radius: 16px 16px 0 0;
  width: 100%;
  padding: 1%;
  bottom: 0;
}
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
