<template lang="pug">
article
  h1 Registrera konto

  form(@submit.prevent="register")
    .group
      app-textfield(v-model="name", label="Namn", name="name", required)
      app-textfield(v-model="email", type="email", label="Email", name="email", required)

    .group
      app-textfield(
        v-model="password", type="password", name="password",
        label="Lösenord", :pattern="pattern", required
      )

      p Lösenordet måste vara minst 8 långt och innehålla:
      ul
        li En stor bokstav
        li En liten bokstav
        li En siffra
        li En utav följande {{ specialChars }}

    .group
      label.checkbox
        input(type="checkbox", required)
        | Jag godkänner behandlingen av mina personuppgifter enligt GDPR
      button.solid(type="submit") Registrera
</template>

<script>
import AppTextfield from '~/components/Textfield.vue';

const regexEscape = str => str.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const SPECIAL_CHARS = '&@!?%#-_';
const SPECIAL_ESC = regexEscape(SPECIAL_CHARS);

export default {
  name: 'Register',
  components: { AppTextfield },
  data: () => ({
    email: '',
    password: '',
    name: '',
    specialChars: SPECIAL_CHARS,
    pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[${SPECIAL_ESC}])[A-Za-z0-9${SPECIAL_ESC}]{8,}$`,
  }),

  methods: {
    async register() {
      try {
        const { email, password, name } = this;

        await this.$store.dispatch('register', { email, password, name });
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

.checkbox > input {
  margin-right: 0.5em;
}

h1 {
  text-align: center;
  color: #333;
}

.group {
  margin: 1em 0;
}

button {
  margin-top: 2em;
  float: right;
}
</style>
