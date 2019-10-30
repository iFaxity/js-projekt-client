<template lang="pug">
article
  h1 Lägg till betalmedel

  form(@submit.prevent="transfer")
    app-textfield(v-model="amount", type="number", label="Belopp", required)

    button.solid(type="submit") Överför belopp
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import AppTextfield from '~/components/Textfield.vue';

export default {
  name: 'Balance',
  components: { AppTextfield },
  data: () => ({ amount: 0 }),

  methods: {
    async transfer() {
      const { amount } = this;

      try {
        await this.$store.dispatch('addBalance', amount);
        this.$router.push({ name: 'home' });
      } catch (ex) {
        this.$store.dispatch('message', ex.message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
article {
  max-width: 400px;
  margin: 0 auto 5em;
}

h1 {
  text-align: center;
  color: #333;
}

button {
  margin-top: 2em;
  float: right;
}
</style>
