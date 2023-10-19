<template>
  <div class="person-list">
    <person-editor
      class="member"
      v-for="(person, index) in people"
      :key="index"
      :person="person"
      :index="index"
      :validation-active="validationActive"
      :validation-issues="validationIssues"
      @removeMember="removeMember"
    />
  </div>
  <div class="inline-button-container" :class="{ hidden: !isFamily }">
    <div>
      <input type="button" value="+ Mitglied hinzufügen" @click="addMember" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import type { Person, ValidationIssues } from '../types'
import PersonEditor from './PersonEditor.vue'

@Component({
  components: { PersonEditor }
})
export default class PersonListEditor extends Vue {
  @Prop({ required: true }) people!: Person[]
  @Prop({ required: true }) isFamily!: false
  @Prop({ required: true }) validationActive!: boolean
  @Prop({ required: true }) validationIssues!: ValidationIssues

  public mounted(): void {
    if (this.people.length === 0) {
      this.addMember()
    }
  }

  public addMember(): void {
    const newMember: Person = {
      isStudent: false
    }
    if (this.people.length >= 1) {
      const memberOne = this.people[0]
      newMember.lastName = memberOne.lastName
      newMember.street = memberOne.street
      newMember.streetNumber = memberOne.streetNumber
      newMember.city = memberOne.city
      newMember.zipCode = memberOne.zipCode
    }
    this.people.push(newMember)
  }

  public removeMember(indexToRemove: number): void {
    if (indexToRemove >= 0 && indexToRemove < this.people.length) {
      this.people.splice(indexToRemove, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
.person-list > .member:not(:last-child) {
  border-bottom: 1px solid lightgray;
}

.member {
  margin-bottom: 10px;
  padding-bottom: 10px;
}
</style>
