<template>
<div class="v-select" :class="[multiple? 'multiple' : 'not-multiple', {'is-disabled': disabled}]">
  <div :class="['v-select-wrap', 'dropdown', className]" v-clickoutside="close">
    <div class="dropdown-wrap">
      <div class="multiple" v-if="multiple" @click="handleInputClick" ref="tags">
        <v-tag v-for="(tag, index) in selectedOption" :key="index" :closable="true" @close="removeItem(tag, $event)">{{tag.currentLabel}}</v-tag>
      </div>
      <input
        :style="inputStyle"
        class="dropdown-input"
        :disabled="disabled"
        @mousedown.prevent="handleInputClick"
        @focus="open"
        @keydown.tab="close"
        @keydown.up="changeHover('pre', $event)"
        @keydown.down="changeHover('next', $event)"
        @keydown.enter="selectItem($event)"
        @keydown.esc="close"
        :placeholder="placeholder"
        readonly="readonly"
        ref="input"
        v-model="showText">
      <i :class="['fa','fa-caret-down',{opened: opened}]" @click="handleInputClick"></i>
    </div>
    <transition name="scale-to-top">
      <ul class="dropdown-list" ref="popper" v-show="opened">
        <slot>
          <template v-for="(option, key) in options">
            <v-option v-if="!option.options" :key="option.label" :disabled="option.disabled" :label="option.label" :value="option.value"></v-option>
            <v-option-group v-else :key="key" :label="option.label">
              <v-option v-for="(item, index) in option.options" :key="item.label" :disabled="item.disabled" :label="item.label" :value="item.value">
              </v-option>
            </v-option-group>
          </template>
        </slot>
      </ul>
    </transition>
  </div>
  <em class="error" v-if="!validity.valid">{{validity.msg}}</em>
</div>
</template>

<script>
  import clickoutside from '../../src/utils/clickoutside.js'
  import validatable from '../validatable/';
  import VOption from './option.vue'
  import VOptionGroup from './option-group.vue'
  import Vtag from '../tag/index.vue'
  export default {
    name: 'v-select',
    props: {
      size: [Number, undefined],
      value: {},
      options: {
        type: [Object, Array],
        default() {
          return []
        }
      },
      disabled: Boolean,
      multiple: {
        type: Boolean,
        default: false 
      },
      placeholder: String,
      rules: Object
    },
    directives: {clickoutside},
    components: {
        "v-option": VOption,
        "v-option-group": VOptionGroup,
        "v-tag": Vtag
    },
    mixins: [validatable],
    data() {
      return {
        searchText: '',
        tempValue: undefined,
        opened: false,
        option: [],
        hoverIndex: -1,
        isSelect: true,
        selectedOption: undefined,
        inputStyle: {}
      }
    },
    computed: {
      className() {
        return this.size ? `size-${this.size}` : ''
      },
      showText() {
          if (!this.multiple) {
            return this.selectedOption?this.selectedOption.currentLabel:'';
          } else if (this.value.length) {
            // 隐藏占位
            return ' ';
          } else {
            return '';
          }
      }
    },
    watch: {
      disabled() {
        if (this.disabled) {
          this.close();
        }
      },
      value() {
        return this.valuechange();
      },
      multiple() {
        if (this.multiple) {//从单转为多
          if (this.selectedOption) {
            this.selectedOption = [this.selectedOption];
          } else {
            this.selectedOption = [];
          }
        } else {
          if (this.selectedOption.length == 1) {
            this.selectedOption = this.selectedOption[0];
          } else {
            this.selectedOption = undefined;
          }
        }
        this.onChange();
      }
    },
    methods: {
      valuechange() {
        // console.log(this.value, this.selectedOption);
        if (this.value == this.tempValue) {
          return;
        } else {
          //if (this.disabled) {
          //  this.$emit('input', this.tempValue);
          //  console.log('Faild: try to change a disabled select value');
          //  //throw new Error('Faild: try to change a disabled select value');
          //  return;
          //}
          this.tempValue = this.value;
        }
        if (this.multiple) {
          if (!Array.isArray(this.value)) {
            this.selectedOption = [];
            this.tempValue = [];
            this.$emit('input', this.tempValue);
            return;
          } else if (this.value.length == 0) {
            this.selectedOption = [];
            return;
          }
          let selectedOption = [];
          let value = Object.assign([], this.value);
          let indexed = {};
          this.option.forEach((item) => {
            if (item.disabled) return true;
            let tempIndex = value.indexOf(item.value);
            if (tempIndex > -1) {
              indexed[tempIndex] = true;
              selectedOption.push(item);
            }
          });
          this.selectedOption = selectedOption;
          let deleted = false;
          for (let index = value.length - 1; index >= 0; index --) {
            if (!indexed[index]) {
              deleted = true;
              value.splice(index, 1);
            }
          }
          if (deleted) {
            this.tempIndex = value;
            this.$emit('input', value);
          }
        } else {
          if (!this.selectedOption || this.value !== this.selectedOption.value) {
            this.selectedOption = undefined;
            let has = false;
            this.option.forEach((item) => {
              if (!item.disabled && item.value === this.value) {
                has = true;
                this.selectedOption = item;
              }
            });
            if (!has && this.value !== '') {
              this.tempValue = '';
              this.$emit('input', '');
            }
          }
        }
      },
      onChange() {
        if (this.multiple) {
          let val = [];
          this.selectedOption.forEach(function(item, index) {
            val.push(item.value);
          })
          this.tempValue = val;
          this.$emit('input', val);
          this.$nextTick(() => {
            if (this.selectedOption.length == 0) {
              this.inputStyle = {};
              return;
            }
            this.inputStyle = {
              height: parseInt(getComputedStyle(this.$refs.tags).height) + 3 + 'px'
            }
          });
        } else {
          this.tempValue = this.selectedOption && this.selectedOption.value || '';
          this.$emit('input', this.selectedOption && this.selectedOption.value || '');
          this.inputStyle = {};
          this.close();
        }
      },
      handleInputClick() {
        if (this.opened) {
          this.$nextTick(() => {
            this.close();
            this.$refs.input.blur();
          });
        } else {
          this.$refs.input.focus();
          this.open();
        }
      },
      toggle() {
        if (this.opened) {
          this.close();
        } else {
          this.open();
        }
      },
      open() {
        if (this.disabled) return;
        this.opened = true;
      },
      close() {
        this.opened = false;
      },
      changeHover(op, start) {
        if (start && start.preventDefault) {
          start.preventDefault();
        }
        if (this.option.length == 0) {
          return;
        }
        if (op == 'pre') {
          if (this.hoverIndex > 0) {
            this.hoverIndex --;
          } else {
            this.hoverIndex = this.option.length - 1;
          }
        } else if (op == 'next') {
          if (this.hoverIndex < this.option.length - 1) {
            this.hoverIndex ++;
          } else {
            this.hoverIndex = 0;
          }
        }
        this.resetScrollTop();
        if (this.option[this.hoverIndex].disabled) {
          // 防止全部的Option都为disabled
          if (this.hoverIndex != start) {
            this.changeHover(op, start || this.hoverIndex);
          } else {
            this.hoverIndex = -1;
            this.resetScrollTop();
          }
        }
      },
      resetScrollTop() {
        if (this.hoverIndex < 0) {
          return;
        }
        let bottomOverflowDistance = this.option[this.hoverIndex].$el.getBoundingClientRect().bottom -
          this.$refs.popper.getBoundingClientRect().bottom;
        let topOverflowDistance = this.option[this.hoverIndex].$el.getBoundingClientRect().top -
          this.$refs.popper.getBoundingClientRect().top;
        if (bottomOverflowDistance > 0) {
          this.$refs.popper.scrollTop += bottomOverflowDistance;
        }
        if (topOverflowDistance < 0) {
          this.$refs.popper.scrollTop += topOverflowDistance;
        }
      },
      selectItem($event) {
        if ($event) {
          $event.preventDefault();
        }
        if (this.disabled) return;
        if (!this.opened) {
          this.open();
          return;
        }
        if (this.hoverIndex < 0 || !this.option[this.hoverIndex] || this.option[this.hoverIndex].disabled) {
          return;
        }
        if (!this.multiple) {
          this.selectedOption = this.option[this.hoverIndex];
          this.onChange();
        } else {
          var index = this.selectedOption.indexOf(this.option[this.hoverIndex]);
          if (index >= 0) {
            this.selectedOption.splice(index, 1);
          } else {
            this.selectedOption.push(this.option[this.hoverIndex]);
          }
          this.onChange();
        }
      },
      removeItem(option, event) {
        event && event.stopPropagation();
        if (this.disabled) return;
        this.selectedOption.splice(this.selectedOption.indexOf(option), 1);
        this.onChange();
      }
    },
    created() {
      if (this.multiple && !Array.isArray(this.value)) {
        this.tempValue = [];
        this.$emit('input', this.tempValue);
        this.selectedOption = [];
      }
      if (!this.multiple && Array.isArray(this.value)) {
        this.tempValue = '';
        this.$emit('input', '');
      } 
    },
    mounted() {
      if ((this.multiple && this.value.length > 0) || !this.multiple) {
        this.valuechange();
      }
    }
  }
</script>
