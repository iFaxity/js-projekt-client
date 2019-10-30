<template lang="pug">
article
  // Add balance form
  // Buy/sell on each card
  // With a small input on every card for amount
  .column.left
    h2 Depå
    p(v-if="!loggedIn") För att köpa/sälja måste du logga in först
    app-textfield#amount(v-model="amount", label="Köp/sälj antal", type="number")

    .cards
      .card(v-for="item of depot", :key="item.id")
        img(:src="item.image")

        .title {{ item.title }}
        .amount(v-if="loggedIn") Du äger: {{ item.amount }} st
        .buttons
          button.solid(@click="buy({ id: item.id, amount })", :disabled="!loggedIn") Köp
          button(@click="sell({ id: item.id, amount})", :disabled="!loggedIn") Sälj

  .column.right
    .chart
      canvas(ref="chart")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import io from 'socket.io-client';
import Chart from 'chart.js';

import store from '~/store';
import AppTextfield from '~/components/Textfield';

const API_URL = process.env.API_URL;
const CHART_MAX_LEN = 20;
const BORDER_COLORS = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
];
const BACKGROUND_COLORS = [
  'rgba(255, 99, 132, 0.05)',
  'rgba(54, 162, 235, 0.05)',
  'rgba(75, 192, 192, 0.05)',
  'rgba(153, 102, 255, 0.05)',
];

const chartConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [],
  },
  datasets: [],
  options: {
    responsive: true,
    lineTension: 1,
    aspectRatio: 2,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          callback: value => `${value} $`,
        }
      }],
    },
  },
};

export default {
  name: 'Home',
  components: { AppTextfield },
  data: () => ({
    amount: 1,
  }),
  computed: {
    ...mapGetters([ 'loggedIn' ]),
    ...mapState([ 'depot' ]),
  },

  beforeRouteEnter(to, from, next) {
    store.dispatch('getDepot').then(() => next());
  },
  mounted() {
    const chart = new Chart(this.$refs.chart, chartConfig);
    const socket = io(API_URL);

    socket.on('error', ex => this.message(ex.message));

    socket.on('price-update', items => {
      // Add label (x axis)
      const { data } = chart;
      const { datasets, labels } = data;

      labels.push(this.getTime());

      if (labels.length >= CHART_MAX_LEN) {
        data.labels = labels.slice(-CHART_MAX_LEN);
      }

      // Add value (y axis)
      for (let item of items) {
        const price = this.formatPrice(item.price);

        const dataset = datasets.find(x => x.label == item.title);
        dataset.data.push(price);

        if (dataset.data.length >= CHART_MAX_LEN) {
          dataset.data = dataset.data.slice(-CHART_MAX_LEN);
        }
      }

      chart.update();
    });

    this.chart = chart;
    this.socket = socket;
    this.initChart();
  },
  beforeDestroy() {
    this.socket.disconnect();
    this.chart.destroy();
  },

  methods: {
    ...mapActions([ 'getDepot', 'buy', 'sell', 'addBalance', 'message' ]),
    getTime() {
      const date = new Date();
      const hours = ('' + date.getHours()).padStart(2, '0');
      const minutes = ('' + date.getMinutes()).padStart(2, '0');
      const seconds = ('' + date.getSeconds()).padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
    },
    initChart() {
      const { chart } = this;

      // Add time label (x axis)
      if (chart.data.labels.length == 0) {
        chart.data.labels.push(this.getTime());

        // Add price (y axis)
        this.depot.forEach((item, idx) => {
          chart.data.datasets.push({
            label: item.title,
            data: [ this.formatPrice(item.price) ],
            backgroundColor: BACKGROUND_COLORS[idx],
            borderColor: BORDER_COLORS[idx],
            borderWidth: 1,
          });
        });
      }

      chart.update();
    },
    formatPrice(price) {
      return Math.round(price * 1000) / 1000;
    }
  },
};
</script>

<style lang="scss" scoped>
article {
  display: flex;
  max-width: 1500px;
  margin: 0 auto;

  .column {
    &.left {
      flex: 0;
      min-width: 600px;
    }

    &.right {
      flex: 1;
      width: 100%;
    }
  }

  @media (max-width: 1200px) {
    flex-direction: column;

    .column.left {
      flex: 1;
      width: 100%;
      min-width: initial;
    }
  }
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
  justify-items: center;
  gap:1em 0.5em;
  margin: 2em 0;

  .card {
    box-shadow: 0 0.4em 0.5em -0.1em rgba(0, 0, 0, 0.4);
    width: 185px;
    padding-bottom: 0.5em;

    .title {
      font-size: 1.1em;
      margin: 0 0.5em;
    }

    .amount {
      margin: 0 0.5em;
    }

    img {
      height: 120px;
      width: 100%;
      margin-bottom: 0.5em;
    }

    .buttons {
      margin-top: 0.5em;
    }
  }
}

.chart {
  canvas {
    width: 100% !important;
  }
}

#amount {
  min-width: 100px;
  max-width: 150px;
}
</style>
