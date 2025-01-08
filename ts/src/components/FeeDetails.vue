<template>
  <div class="membership-fee-container">
    <span class="membership-fee-label">
      {{ label }}
    </span>
    <span class="membership-fee">{{ fee }}€</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'

@Component({
  components: {},
})
export default class FeeDetails extends Vue {
    @Prop({ required: true }) label!: string
    @Prop({ required: true }) fee!: number
}
</script>

<style lang="scss" scoped>
.membership-fee-container {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;

  .membership-fee-label {
    margin-right: 15px;
  }

  .membership-fee {
    padding-right: 5px;
    font-weight: bold;
  }
}
</style>