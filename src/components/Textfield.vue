<template lang="pug">
.textfield(:id="id")
  input(v-model="model", :type="inputType", placeholder=" ", v-bind="$attrs", v-on="listeners")
  label(:for="uuid")
    slot {{ label }}
  span.show(v-if="isPassword", @click="toggleShow") {{ show ? 'Göm' : 'Visa' }}
</template>

<script>
import uuid from '~/lib/uuid';

export default {
  name: 'AppTextfield',
  inheritAttrs: false,
  model: {
    event: 'input',
    prop: 'value',
  },
  props: {
    value: [String, Number],
    label: String,
    type: String,
    id: String,
  },

  data: () => ({ uuid: uuid('_tf_'), show: false }),
  computed: {
    listeners() {
      const { input, ...listeners } = this.$listeners;
      return listeners;
    },
    isPassword() {
      return this.type === 'password';
    },
    inputType() {
      if (this.isPassword && this.show) {
        return 'text';
      }
      return this.type;
    },
    model: {
      get() {
        return this.value;
      },
      set(value) {
        if (this.type == 'number') {
          this.$emit('input', +value);
        } else {
          this.$emit('input', value);
        }
      },
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    }
  },
};
</script>

<style lang="scss" scoped>
.textfield {
  position: relative;
  min-width: 100px;
  margin: 0.3em 0;
  width: 100%;
  color: #405863;
  height: 3.25em;
}

.show {
  display: inline-block;
  position: absolute;
  opacity: 0.5;
  right: 0.5em;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.2s ease;
  cursor: pointer;
  user-select: none;

  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}

label {
  position: absolute;
  top: 1em;
  left: 1em;
  opacity: 0.5;
  transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease;
  will-change: transform, opacity, color;
  transform-origin: top left;
  pointer-events: none;
  user-select: none;
}

input {
  background: #e6e6e6;
  font-size: 1em;
  padding: 1.5em 1em 0.5em;
  width: 100%;
  transition: border-color 0.2s ease, opacity 0.2s ease;
  border: none;
  border-bottom: 0.1em solid #8ea3ac;
  border-radius: 0.2em;
  outline: none;
  box-sizing: border-box;
  opacity: 0.5;

  &:hover {
    opacity: 0.8;
  }
  &:focus {
    border-color: #397eff;
    opacity: 1;
  }
  &:focus + label,
  &:not(:placeholder-shown) + label {
    color: #397eff;
    transform: translateY(-60%) scale(0.9);
    opacity: 1;
  }
  &:invalid {
    border-color: #f00;

    & + label {
      color: #f00;
    }
  }

  // Add required sign to label
  &:required + label::after {
    content: '*';
  }

  // Remove spinbox on number fields (works for Firefox and Chrome)
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance:textfield;
  }
}
</style>
