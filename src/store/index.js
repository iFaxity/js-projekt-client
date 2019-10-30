import Vue from 'vue';
import Vuex from 'vuex';
import { request, parseToken } from './api';

const API_URL = process.env.API_URL;
let messageId = 1;

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    tokenExpire: null,
    balance: null,
    email: null,
    name: null,
    depot: [],
    messages: [],
  },
  getters: {
    loggedIn(state) {
      const now = Math.floor(Date.now() / 1000);
      return state.tokenExpire && now < state.tokenExpire;
    },
  },
  actions: {
    async request(ctx, opts) {
      if (opts.auth) {
        if (!ctx.state.token) {
          throw new Error('Not logged in yet, can\'t send request.');
        }

        opts.headers = opts.headers || {};
        opts.headers['Authorization'] = `Bearer ${ctx.state.token}`;
      }

      const body = await request(API_URL, opts);

      // Renew token if needed
      if (body && body.token) {
        ctx.commit('login', body.token);
      }

      return body.data;
    },
    login(ctx, { email, password }) {
      return ctx.dispatch('request', {
        path: '/login',
        method: 'post',
        data: { email, password },
      }).catch(ex => ctx.dispatch('message', ex.message));
    },
    register(ctx, { email, name, password }) {
      return ctx.dispatch('request', {
        path: '/register',
        method: 'post',
        data: { email, name, password },
      }).catch(ex => ctx.dispatch('message', ex.message));
    },
    logout(ctx) {
      ctx.commit('logout');
    },
    message(ctx, text) {
      const id = messageId++;

      ctx.commit('addMessage', { id, text });
      setTimeout(() => ctx.commit('removeMessage', id), 10000);
    },

    async getDepot(ctx) {
      try {
        if (ctx.getters.loggedIn) {
          const { depot, balance } = await ctx.dispatch('request', { path: '/', auth: true });

          ctx.commit('setDepot', depot);
          ctx.commit('setBalance', balance);
        } else {
          const { depot } = await ctx.dispatch('request', { path: '/' });

          ctx.commit('setDepot', depot);
        }
      } catch (ex) {
        ctx.dispatch('message', ex.message);
      }
    },
    async buy(ctx, { id, amount }) {
      try {
        if (amount < 1) {
          throw new Error('Köpmängden kain inte vara mindre än 1.');
        } else if (!Number.isInteger(amount)) {
          throw new Error('Köpmängd måste vara ett heltal.');
        }

        const res = await ctx.dispatch('request', {
          path: '/buy',
          method: 'post',
          data: { id, amount },
          auth: true,
        });

        ctx.commit('updateDepot', { id, amount: res.amount });
        ctx.commit('setBalance', res.balance);
      } catch (ex) {
        ctx.dispatch('message', ex.message);
      }
    },
    async sell(ctx, { id, amount }) {
      try {
        if (amount < 1) {
          throw new Error('Säljmängden kan inte vara mindre än 1.');
        } else if (!Number.isInteger(amount)) {
          throw new Error('Köpmängd måste vara ett heltal.');
        }

        const res = await ctx.dispatch('request', {
          path: '/sell',
          method: 'post',
          data: { id, amount },
          auth: true,
        });

        ctx.commit('updateDepot', { id, amount: res.amount });
        ctx.commit('setBalance', res.balance);
      } catch (ex) {
        ctx.dispatch('message', ex.message);
      }
    },
    async addBalance(ctx, amount) {
      try {
        const { balance } = await ctx.dispatch('request', {
          path: '/balance',
          method: 'post',
          data: { amount },
          auth: true,
        });

        ctx.commit('setBalance', balance);
      } catch (ex) {
        ctx.dispatch('message', ex.message);
      }
    },
  },
  mutations: {
    login(state, token) {
      const payload = parseToken(token);

      state.token = token;
      state.tokenExpire = payload.exp;
    },
    logout(state) {
      state.token = null;
      state.tokenExpire = null;
    },
    setDepot(state, depot) {
      state.depot = depot;
    },
    updateDepot(state, { id, amount }) {
      const idx = state.depot.findIndex(x => x.id == id);
      const item = state.depot[idx];
      const newItem = { ...item, amount };

      state.depot.splice(idx, 1, newItem);
      //Vue.set(state.depot, id, item);
    },
    setBalance(state, balance) {
      state.balance = balance;
    },
    addMessage(state, message) {
      state.messages.unshift(message);
    },
    removeMessage(state, id) {
      const index = state.messages.findIndex(x => x.id == id);

      if (index >= 0) {
        state.messages.splice(index, 1);
      }
    }
  },
});
