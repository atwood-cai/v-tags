<template>
<div :style="{display: visible ? 'block' : 'none'}" class="modal-box">
  <div class="modal-dialog">
    <div :class="{'public-modal': type!='modal'}" class="modal">
      <div v-if="title" class="modal-hd">
        <span v-if="safe" class="title" v-html="title"></span>
        <span class="title" v-else>{{title}}</span>
        <span v-if="subTitle && safe" class="sub-title" v-html="subTitle"></span>
        <span v-else-if="subTitle" class="sub-title">{{subTitle}}</span>
        <a @click="hide" class="fa fa-times close"></a></div>
      <div class="modal-bd">
        <slot></slot>
      </div>
    </div>
  </div>
  <div class="modal-mask"></div>
</div>
</template>


<script>
//import Vue from 'vue'
export default {
  name: 'v-modal',
  props: {
    type: {
      default : 'modal'
    },
    title: String,
    subTitle: String,
    visible: {
      type: Boolean,
      default: false
    },
    safe: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _centerModal () {
      var elem = this.$el.querySelector('.modal');
      var w = elem.offsetWidth;
      var h = elem.offsetHeight;
      elem.style.marginLeft = '-' + w / 2 + 'px';
      elem.style.marginTop = '-' + h / 2 + 'px';
    },
    _removeModal () {
      this.$el.parentNode.removeChild(this.$el);
    },
    show () {
      this.$emit('openmodal');
    },
    hide () {
      this.$emit('closemodal');
    }
  },
  created () {
    this.$watch('visible', function(){
      this.visible && this.$nextTick(this._centerModal);
    });
  },
  mounted() {
    this._centerModal();
  },
  destroy() {
     this._removeModal();
  }
}
</script>
