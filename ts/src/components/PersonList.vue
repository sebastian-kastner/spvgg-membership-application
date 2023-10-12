<template>
  <div class="person-list">
    <person-view
      class="member"
      v-for="(person, index) in people"
      :key="index"
      :person="person"
      :index="index"
      :validation-active="validationActive"
      :validation-issues="validationIssues"
    />
  </div>
  <div class="add-member-container" :class="{ hidden: !isFamily }">
    <div>
      <input type="button" value="+ Weiteres Familienmitglied hinzufügen" @click="addMember" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import type { Person, ValidationIssues } from '../types'
import PersonView from './PersonView.vue'

@Component({
  components: { PersonView }
})
export default class PersonList extends Vue {
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
}
</script>

<style lang="scss" scoped>
.add-member-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

input[type='button'] {
  background-color: lighten(rgb(16, 59, 94), 30%);
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

.person-list > .member:not(:last-child) {
  border-bottom: 1px solid lightgray;
}

.member {
  margin-bottom: 10px;
  padding-bottom: 10px;
}
</style>
