<template>
  <div :class="$style.topbar">
    <div class="mr-md-4 mr-auto d-none d-sm-block">
      <search />
    </div>
    <!-- <div class="mr-md-4 mr-auto">
      <notifications-dropdown></notifications-dropdown>
    </div> -->
    <div class="mr-4 d-none d-sm-block ml-auto">
      <div style="text-align: center; margin-right: 2em; display: ">
        <div class="font-weight-bold text-dark">{{ date }}</div>
        <div class="text-dark">{{ time }}</div>
      </div>
    </div>
    <div class="mr-md-2">
      <user-menu />
    </div>
  </div>
</template>

<script>
import Search from '@/components/layout/TopBar/Search'
import NotificationsDropdown from '@/components/layout/TopBar/NotificationsDropdown'
import UserMenu from '@/components/layout/TopBar/UserMenu'

export default {
  data() {
    return {
      time: '',
      date: '',
      week: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
    }
  },

  components: {
    Search,
    UserMenu,
    NotificationsDropdown
  },

  mounted() {
    let timerID = setInterval(this.updateTime, 1000);
    this.updateTime();
  },

  methods: {
    updateTime() {
      let cd = new Date();
      this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
      this.date =  this.zeroPadding(cd.getDate(), 2) + '/' + this.zeroPadding(cd.getMonth()+1, 2) + '/' + this.zeroPadding(cd.getFullYear(), 4) + ' ' + this.week[cd.getDay()];
    },

    zeroPadding(num, digit) {
      let zero = '';
      for(let i = 0; i < digit; i++) {
          zero += '0';
      }
      return (zero + num).slice(-digit);
    },
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
