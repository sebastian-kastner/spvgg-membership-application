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
  <div class="inline-button-container">
    <div>
      <!-- TODO: only show if there is < 1 spouse in the list of members -->
      <input type="button" class="primary-btn" value="+ Kind hinzufügen" @click="addChild" />
      <input type="button" class="primary-btn" value="+ (Ehe-)Partner hinzufügen" @click="addSpouse" v-if="canAddSpouse" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import { Checked, type Member, MemberType, type ValidationIssues } from '../types'
import MemberEditor from './MemberEditor.vue'

@Component({
  components: { MemberEditor }
})
export default class MemberListEditor extends Vue {
  @Prop({ required: true }) members!: Member[]
  @Prop({ required: true }) validationActive!: boolean
  @Prop({ required: true }) validationIssues!: ValidationIssues
  @Prop({ required: true }) canAddSpouse!: boolean

  public addChild(): void {
    this.addMember(MemberType.CHILD)
  }

  public addSpouse(): void {
    if (!this.canAddSpouse) {
      console.error("Cannot add spouse, because there is already a spouse in the list of members")
      return
    }
    this.addMember(MemberType.SPOUSE)
  }

  private addMember(memberType: MemberType): void {
    const newMember: Member = {
      memberType: memberType,
      isStudent: false,
      sections: {
        football: Checked.NO,
        bowling: Checked.NO,
        theatre: Checked.NO,
        fitness: Checked.NO
      }
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
