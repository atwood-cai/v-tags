<template>
  <li
    v-show="innerVisiable"
    @click="selectItem"
    @mouseenter="hoverItem"
    class="dropdown-select-item"
    :class="{'selected': selected,'hover': hovered}">
    <span class="wrap" ref="label">
      <slot>
        {{ currentLabel }}
      </slot>
    </span>
  </li>
</template>
<script>
  export default {
    name: 'v-suggest-item',
    props: {
      label: String,
      value: '',
      visiable: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        innerVisiable: true
      }
    },
    computed: {
      currentLabel() { return  this.label || this.$refs.label.innerHTML},
      suggest() {
        let result = this.$parent;
        while (!result.isSuggest) {
          result = result.$parent;
        }
        return result;
      },
      index() {
        return this.suggest.suggestion.indexOf(this);
      },
      selected() {
        return this.suggest.selectedSuggest === this;
      },
      hovered() {
        return this.suggest.hoverIndex == this.index
      }
    },
    watch: {
      visiable() {
        this.innerVisiable = this.visiable;
      },
      innerVisiable() {
        if (this.innerVisiable) {
          this.suggest.visiableCount++;
        } else {
          this.suggest.visiableCount--;
        }
      }
    },
    methods: {
      hoverItem() {
        this.suggest.hoverIndex = this.index;
      },
      selectItem() {
        this.suggest.selectItem();
      },
      destroyOrDisabled() {
        if (this.selected) {
          this.suggest.selectedSuggest = undefined;
          this.suggest.onChange();
        }
        if (this.suggest.hoverIndex == this.index) {
          this.suggest.hoverIndex = -1;
        }
        if (this.innerVisiable) {
          this.suggest.visiableCount--;
        }
      }
    },
    created() {
      this.suggest.suggestion.push(this);
      if (this.innerVisiable) {
        this.suggest.visiableCount++;
      }
    },
    beforeDestroy() {
      this.suggest.suggestion.splice(this.index, 1);
      this.destroyOrDisabled();
    }
  }
</script>
