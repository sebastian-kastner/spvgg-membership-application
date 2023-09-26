<template>
    <div class="form-container">
        <form action="/action_page.php">
            <div class="row">
                <div class="col-35">
                    <label for="new_member">Wer soll Mitglied werden?</label>
                </div>
                <div class="col-65">
                    <select name="new_member" id="new_member">
                        <option value="self">Ich möchte Mitglied werden</option>
                        <option value="other">Ich möchte die Mitgliedschaft für eine andere Person beantragen</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-35">
                    <label for="membership_start">Ab wann willst Du als Mitglied bei der SpVgg Deuringen aufgenommen
                        werden?</label>
                </div>
                <div class="col-65">
                    <select id="membership_start" name="membership_start">
                        <option>Nächstmöglicher Zeitpunkt</option>
                        <option>Ab dem..</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-35">
                    <label for="membership_type">Welche Art von Mitgliedschaft willst Du beantragen?</label>
                </div>
                <div class="col-65">
                    <select id="membership_type" name="membership_type">
                        <option value="family">Familienmitgliedschaft</option>
                        <option value="single">Einzelmitgliedschaft</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-35">
                    <label for="membership_type">Welche Art von Mitgliedschaft willst Du beantragen?</label>
                </div>
                <div class="col-65">
                    <select id="membership_type" name="membership_type">
                        <option value="family">Familienmitgliedschaft</option>
                        <option value="single">Einzelmitgliedschaft</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <input type="submit" value="Submit">
            </div>
        </form>
    </div>
</template>
  
<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'


@Component({
     components: {},
})
export default class MembershipForm extends Vue {
    
}
</script>
  
<style lang="scss" scoped></style>
  