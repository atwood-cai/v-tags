<template>
  <div class="input-wrap">
    <input
      v-if="type!='textarea' && type!='radio'"
      :class="className"
      :type="type"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="onInput"
      @change="onInput"
    >
    <textarea
      v-if="type=='textarea'"
      :class="className"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :maxlength="maxlength"
      :rows="rows"
      :cols="cols"
      @input="onInput"
      @change="onInput">
    </textarea>
    <em class="error" v-if="!validity.valid">{{validity.msg}}</em>
  </div>
</template>

<script>
  import validatable from '../validatable/';

  export default {
    name: 'v-input',
    props: {
      value: [String, Number],
      rules: Object,
      placeholder: String,
      size: String,
      readonly: Boolean,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      rows: {
        type: Number,
        default: 3
      },
      cols: {
        type: Number,
        default: 60
      },
      maxlength: [Number, String]
    },
    computed: {
      className() {
        var cn = this.validity.valid ? '' : 'error';
        if(this.size){
          cn = `${cn} size-${this.size}`;
        }
        return cn;
      }
    },
    mixins: [validatable],
    methods: {
      onInput(e) {
        this.$emit('input', e.target.value);
      },
      onChange(e) {
        this.$emit('input', e.target.value);
      }
    }
  }
</script>
