<template>
  <div class="meetingInfo">
    <div class="content">
      <div class="expertPageTitle">
        <p>会议信息</p>
      </div>
      <div class="meetingContent">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="查房医院">
            {{form.check_room_hospital}}
          </el-form-item>
          <el-form-item label="查房日期">
            {{form.check_room_data}}
          </el-form-item>
          <el-form-item label="城市">
            {{ form.city }}
          </el-form-item>
          <el-form-item label="大区">
            {{ form.area }}
          </el-form-item>
          <el-form-item label="负责人">
            {{ form.charge_man }}
          </el-form-item>
          <el-form-item label="联系电话">
            {{ form.charge_man_phone }}
          </el-form-item>
          <el-form-item label="陪同人">
            {{ form.company_man }}
          </el-form-item>
          <el-form-item label="联系电话">
            {{ form.company_man_phone }}
          </el-form-item>
          <div class="btnGroup">
            <el-button type="primary" v-if="!form.meeting_material">
              <router-link tag="p" to="/meetingMaterial">提交材料</router-link>
            </el-button>
            <el-button type="primary" v-if="form.meeting_material">
              <router-link tag="p" to="/meetingMaterial">编辑</router-link>
            </el-button>
            <el-button type="primary" v-if="userInfo.role === 2" @click="onDel">删除</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCosToken } from "@/api/login";
import { deleteMeeting } from "@/api/expert/index";
import { uuid, getCookie } from "@/utils/index";
export default {
  data() {
    return {
      form: {},
      userInfo: {}
    };
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
      this.form = JSON.parse(localStorage.getItem("meetingInfo"));
    }
  },
  methods: {
    async onDel() {
      await deleteMeeting({
        reqid: uuid(),
        id: this.form.id,
        create_man_id: this.form.create_man_id
      }).then(res => {
        if(res.data.status === 0) {
          this.$message.success('删除成功');
          this.$router.push('/expert')
        }else {
          this.$message.error(res.data.message);
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.meetingInfo {
  position: relative;
  overflow: hidden;
  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
  }
  .title {
    width: 100%;
    height: 100px;
    background: #ddd;
    text-align: center;
    padding-top: 25px;
    box-sizing: border-box;
  }
  .meetingContent {
    padding: 20px 10px;
  }
  .btnGroup {
    margin: 0 auto;
    text-align: center;
  }
}
</style>
