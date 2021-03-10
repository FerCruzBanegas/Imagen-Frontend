<template>
  <li
    v-show="permission(item.permission) || item.permission ==''"
    :class="{
      [styles.air__menuLeft__item]: true,
      [styles.air__menuLeft__item__active]: item.key === activeItem,
    }"
  >
    <router-link v-if="item.url" :to="item.url" :class="styles.air__menuLeft__link">
      <i
        v-if="item.icon"
        :class="{
          [item.icon]: true,
          [styles.air__menuLeft__icon]: true,
        }"
      />
      <span>{{ item.title }}</span>
    </router-link>
    <a href="javascript: void(0);" v-if="!item.url" :class="styles.air__menuLeft__link">
      <i
        v-if="item.icon"
        :class="{
          [item.icon]: true,
          [styles.air__menuLeft__icon]: true,
        }"
      />
      <span>{{ item.title }}</span>
    </a>
  </li>
</template>

<script>
import permission from '../../../../mixins/permission'

export default {
  name: 'Item',
  props: {
    item: Object,
    styles: Object,
    activeItem: String,
  },

  mixins: [permission]
}
</script>
