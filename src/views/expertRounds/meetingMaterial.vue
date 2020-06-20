<template>
  <div class="meetingMaterial">
    <EditMaterial v-show="isShowEditMaterial" :meetingMaterial="meetingInfo.meeting_material" @meetingMaterial="getMeetingMaterial"></EditMaterial>
    <LabourReimbursement 
      v-show="isLabourReimbursement" 
      @labourReimbursement="getLabourReimbursement"
      @isAddAccommodation="showAccommodation"
      @isLabourReimbursement="showEditMaterial"
    ></LabourReimbursement>
    <Accommodation 
      v-show="isAccommodation" 
      @otherFee="getOtherFee"
      @isAccommodation="showLabourReimbursement"></Accommodation>
  </div>
</template>

<script>
import EditMaterial from './components/editMaterial'
import LabourReimbursement from './components/labourReimbursement'
import Accommodation from './components/accommodation'
import { uuid, getCookie } from "@/utils/index";
import {updateMeeting} from '@/api/expert/index';
export default {
  components: {
    EditMaterial,
    LabourReimbursement,
    Accommodation
  },
  data() {
    return {
      isShowEditMaterial: true,
      isLabourReimbursement: false,
      isAccommodation: false,
      userInfo: {},
      meetingInfo: {}
    }
  },
  created() {
    if(!getCookie('userInfo')) {
      this.$message.error('请重新登录')
      this.$router.push('/login');
    } else {
      this.userInfo = JSON.parse(getCookie('userInfo'));
    }
    if(!localStorage.getItem("meetingInfo")) {
      this.$message.error('暂无会议信息')
      this.$router.push('/expert');
    } else {
      this.meetingInfo = JSON.parse(localStorage.getItem("meetingInfo"));
    }
  },
  methods: {
    getMeetingMaterial(e) {
      this.isShowEditMaterial = false;
      this.isLabourReimbursement = true;
      this.isAccommodation = false;
      this.$set(this.meetingInfo,'meeting_material',e);
    },
    getLabourReimbursement(e) {
      this.$set(this.meetingInfo,'lao_wu',e);
    },
    showAccommodation(e) {
      if(e) {
        this.isAccommodation = e;
        this.isShowEditMaterial = false;
        this.isLabourReimbursement = false;
        this.isAccommodation = true;
      } else {
        this.submitUpdateMeeting();
      }
      
    },
    showEditMaterial(e) {
      if(!e) {
        this.isShowEditMaterial = e;
        this.isShowEditMaterial = true;
        this.isLabourReimbursement = false;
        this.isAccommodation = false;
      }
    },
    showLabourReimbursement(e) {
      if(!e) {
        this.isShowEditMaterial = e;
        this.isShowEditMaterial = false;
        this.isLabourReimbursement = true;
        this.isAccommodation = false;
      }
    },
    async getOtherFee(e) {
      this.$set(this.meetingInfo,'other_fee',e);
      this.submitUpdateMeeting();
    },
    async submitUpdateMeeting() {
      this.$set(this.meetingInfo,'reqid',uuid());
      await updateMeeting(this.meetingInfo).then(res => {
        if(res.data.status === 0) {
          this.$message.success('提交成功');
          this.$router.push('/expert');
        } else {
          this.$message.error(res.data.message);
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.meetingMaterial {
  
}
</style>
