<template lang="pug">
article
  h1 Login

  form(@submit.prevent="login")
    app-textfield(v-model="email", type="email", label="Email", name="email", required)
    app-textfield(
      v-model="password", type="password", name="password",
      label="Lösenord", :pattern="pattern", required
    )
    button.solid(type="submit") Logga in
</template>

<script>
import AppTextfield from '~/components/Textfield.vue';

const regexEscape = str => str.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const SPECIAL_CHARS = '&@!?%#-_';
const SPECIAL_ESC = regexEscape(SPECIAL_CHARS);

export default {
  name: 'Login',
  components: { AppTextfield },
  data: () => ({
    email: '',
    password: '',
    specialChars: SPECIAL_CHARS,
    pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[${SPECIAL_ESC}])[A-Za-z0-9${SPECIAL_ESC}]{8,}$`,
  }),

  methods: {
    async login() {
      const { email, password } = this;

      try {
        await this.$store.dispatch('login', { email, password });
        this.$router.push({ name: 'home' });
      } catch (ex) {
        this.$store.dispatch('message', ex.message);
      }
    }
  }
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
