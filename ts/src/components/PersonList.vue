<template>
  <person-view v-for="(person, index) in people" :key="index" :person="person" :index="index" />
  <div v-if="isFamily">Add someone!</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import type { Person } from '../types'
import PersonView from './PersonView.vue'

@Component({
  components: { PersonView }
})
export default class PersonList extends Vue {
  @Prop people!: Person[]
  @Prop isFamily!: false
}
</script>

<style lang="scss" scoped></style>
