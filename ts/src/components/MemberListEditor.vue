<template>
  <div class="member-list">
    <!-- creator -->
    <member-editor
      class="member"
      :member="members.creator"
      :index="-2"
      :validation-active="validationActive"
      :validation-issues="validationIssues"
      @removeMember="removeMember"
    />
  </div>
  <div class="inline-button-container" :class="{ hidden: !canAddSpouse }">
    <div>
      <input
        type="button"
        class="primary-btn"
        value="+ (Ehe-)Partner hinzufügen"
        @click="addSpouse"
      />
    </div>
  </div>
  <div class="member-list">
    <member-editor
      v-if="members.spouse"
      class="member"
      :member="members.spouse"
      :index="-1"
      :validation-active="validationActive"
      :validation-issues="validationIssues"
      @removeMember="removeMember"
    />
    <member-editor
      class="member"
      v-for="(member, index) in members.children"
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
      <input type="button" class="primary-btn" value="+ Kind hinzufügen" @click="addChild" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import {
  Checked,
  type ApplicationMembers,
  type Member,
  MemberType,
  type ValidationIssues
} from '../types'
import MemberEditor from './MemberEditor.vue'

@Component({
  components: { MemberEditor }
})
export default class MemberListEditor extends Vue {
  @Prop({ required: true }) members!: ApplicationMembers
  @Prop({ required: true }) validationActive!: boolean
  @Prop({ required: true }) validationIssues!: ValidationIssues
  @Prop({ required: true }) canAddSpouse!: boolean

  public addChild(): void {
    this.addMember(MemberType.CHILD)
  }

  public addSpouse(): void {
    if (!this.canAddSpouse) {
      console.error('Cannot add spouse! There cannot be more than one spouse!')
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

    const creator = this.members.creator
    newMember.lastName = creator.lastName

    if (memberType === MemberType.SPOUSE) {
      this.members.spouse = newMember
    } else if (memberType === MemberType.CHILD) {
      this.members.children.push(newMember)
    }
  }

  public removeMember(memberToDelete: Member): void {
    if (memberToDelete.memberType === MemberType.SPOUSE) {
      this.members.spouse = null
    } else if (memberToDelete.memberType === MemberType.CHILD) {
      const childIndex = this.members.children.findIndex((member) => member == memberToDelete)
      if (childIndex !== -1) {
        this.members.children.splice(childIndex, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.member-list > .member:not(:last-child) {
  border-bottom: 1px solid lightgray;
}

.inline-button-container input {
  width: 260px;
}

.member {
  margin-bottom: 10px;
  padding-bottom: 10px;
}
</style>
