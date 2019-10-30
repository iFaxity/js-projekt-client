<template lang="pug">
#app
  header
    nav.left
      span.title CakeStocks
      router-link(:to="{ name: 'home' }") Hem
      router-link(v-if="loggedIn", :to="{ name: 'balance' }") Betalmedel

    nav.right(v-if="loggedIn")
      span.balance {{ balance }} $
      router-link(:to="{ name: 'logout' }") Logout
    nav.right(v-else)
      router-link(:to="{ name: 'login' }") Login
      router-link(:to="{ name: 'register' }") Registrera
  main
    router-view

    .messages
      .message(v-for="m of messages", :key="m.id", :class="m.type") {{ m.text }}
  footer
    p Copyright © 2019 CakeStocks, cake.faxity.se
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters([ 'loggedIn' ]),
    ...mapState([ 'messages' ]),
    balance() {
      return (this.$store.state.balance || 0).toFixed(2);
    }
  },
};
</script>

<style lang="scss" scoped>
  #app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #f5f5f5;
  }

  header {
    position: sticky;
    top: 0;
    flex: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;
    margin-bottom: 1em;
    background: #397eff;
    color: #fff;
    box-shadow: 0 0 0.5em 0.1em rgba(0, 0, 0, 0.5);
    z-index: 10;

    .title {
      font-size: 1.1em;
    }

    nav {
      flex: 0 auto;
      padding: 0.5em 0;

      &.left {
        align-self: flex-start;
      }
      &.right {
        align-self: flex-end;
      }

      a,
      span {
        display: inline-block;
        color: inherit;
        padding: 0.5em 0.8em;
        margin: 0 0.2em;
        text-decoration: none;
        border-bottom: 0.1em solid transparent;
        user-select: none;
      }

      a {
        &.active {
          border-color: #fff;
        }
        &:hover {
          border-color: #fff;
        }
      }
    }
  }

  main {
    flex: 1;
    padding: 1em;
  }

  .messages {
    position: fixed;
    bottom: 1em;
    left: 0.5em;
    width: 300px;

    .message {
      color: #fff;
      background: #333;
      padding: 0.5em 1em;
      margin-bottom: 0.5em;
      border: 1px solid #333;

      @media (max-width: 480px) {
        right: 0.5em;
        width: auto;
      }
    }
  }

  footer {
    padding: 1em;
    background: #397eff;
    color: #fff;
    box-shadow: 0 0 0.5em 0.1em rgba(0, 0, 0, 0.5);
    flex: 0;

    p {
      margin: 0;
    }
  }
</style>
