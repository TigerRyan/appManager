<template>
  <img :src="src || defSrc" ref="img" :alt="alt" @error="$refs.img.src = defSrc" :style="{verticalAlign:'middle',width:width+'px',height:height+'px',borderRadius:circle?'50%':'6px'}"/>
</template>
<script>
  export default {
    name: 'headImg',
    props: {
      src: {
        type: String,
        default: '',
      },
      defSrc: {
        type: String,
        default: '/static/img/admin.png',
      },
      alt: {
        type: String,
        default: '',
      },
      width: {
        type: String,
        default: '64',
      },
      height: {
        type: String,
        default: '64',
      },
      circle: {
        type: Boolean,
        default: true,
      },
    },
  }
</script>
