<template>
  <div class="member-list">
    <member-editor
      class="member"
      v-for="(member, index) in members"
      :key="index"
      :member="member"
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
import type { Member, ValidationIssues } from '../types'
import MemberEditor from './MemberEditor.vue'

@Component({
  components: { MemberEditor }
})
export default class MemberListEditor extends Vue {
  @Prop({ required: true }) members!: Member[]
  @Prop({ required: true }) isFamily!: false
  @Prop({ required: true }) validationActive!: boolean
  @Prop({ required: true }) validationIssues!: ValidationIssues

  public mounted(): void {
    if (this.members.length === 0) {
      this.addMember()
    }
  }

  public addMember(): void {
    const newMember: Member = {
      isStudent: false
    }
    if (this.members.length >= 1) {
      const memberOne = this.members[0]
      newMember.lastName = memberOne.lastName
      newMember.street = memberOne.street
      newMember.streetNumber = memberOne.streetNumber
      newMember.city = memberOne.city
      newMember.zipCode = memberOne.zipCode
    }
    this.members.push(newMember)
  }

  public removeMember(indexToRemove: number): void {
    if (indexToRemove >= 0 && indexToRemove < this.members.length) {
      this.members.splice(indexToRemove, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
.member-list > .member:not(:last-child) {
  border-bottom: 1px solid lightgray;
}

.member {
  margin-bottom: 10px;
  padding-bottom: 10px;
}
</style>
