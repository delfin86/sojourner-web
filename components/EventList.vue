<template>
  <div>
    <day-tabs>
      <template v-for="dayEvents in allDayEvents">
        <v-tab ripple :disabled="dayEvents.events.length === 0">
          {{ dayEvents.day.name }}
        </v-tab>
        <v-tab-item>
          <v-list v-if="dayEvents.events.length > 0" three-line class="pa-0">
            <template v-for="(event, index) in dayEvents.events">
              <event :event="event" :show-room="showRoom"></event>
              <v-divider v-if="index + 1 < dayEvents.events.length"></v-divider>
            </template>
          </v-list>
          <v-list v-else>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title>
                  There are no events on this list.
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-tab-item>
      </template>
    </day-tabs>
    <div class="hidden-sm-and-down mb-5"></div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import DayTabs from '@/components/DayTabs'
import Event from '@/components/Event'

export default {
  name: 'events',

  components: {
    DayTabs,
    Event
  },

  props: {
    events: Array,
    showRoom: Boolean
  },

  created () {
    this.switchTabIfNoEvents()
  },

  activated () {
    this.switchTabIfNoEvents()
  },

  computed: {
    allDayEvents () {
      return this.allDays.map(day => ({
        day,
        events: this.events.filter(event => event.day.index === day.index)
      }))
    },

    ...mapGetters([
      'allDays',
      'tab'
    ])
  },

  methods: {
    switchTabIfNoEvents () {
      if (!this.allDayEvents[this.tab] || this.allDayEvents[this.tab].events.length === 0) {
        const tab = this.allDayEvents.findIndex(dayEvents => dayEvents && dayEvents.events.length > 0)
        this.setTab(tab !== -1 ? tab : 0)
      }
    },

    ...mapActions([
      'setTab'
    ])
  }
}
</script>

<style scoped>
</style>
