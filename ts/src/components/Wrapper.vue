<template>
  <div class="wrapper">
    <membership-form-editor :appMode="appMode" :application="application" v-if="isEditMode" />
    <membership-confirmation :appMode="appMode" :application="application" v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import MembershipFormEditor from './MembershipFormEditor.vue'
import MembershipConfirmation from './MembershipConfirmation.vue'
import type { Application, AppMode } from '../types'
import { Checked } from '../types'
import { createDefaultMembership } from '../devUtils'

@Component({
  components: { MembershipFormEditor, MembershipConfirmation }
})
export default class Wrapper extends Vue {
  appMode: AppMode = {
    isEditMode: true
  }

  application: Application = createDefaultMembership()
  // application: Application = {
  //   membership_start_date: new Date(),
  //   members: [],
  //   sections: {
  //     football: Checked.NO,
  //     bowling: Checked.NO,
  //     fitness: Checked.NO,
  //     theatre: Checked.NO
  //   }
  // }

  get isEditMode(): boolean {
    return this.appMode.isEditMode
  }
}
</script>

<style lang="scss" scoped></style>
