<template>
  <div class="expertRounds">
    <div class="expertPageTitle">
      <p>专家来查房</p>
    </div>
    <div class="createMeeting">
      <p @click="onCreateMeeting">+ 创建会议</p>
    </div>
    <el-tabs v-model="activeName" stretch>
      <el-tab-pane label="今日会议" name="1">
        <MeetList :meetingList="meetingList"></MeetList>
      </el-tab-pane>
      <el-tab-pane label="未开始" name="2">
         <MeetList :meetingList="meetingList"></MeetList>
      </el-tab-pane>
      <el-tab-pane label="历史会议" name="3">
         <MeetList :meetingList="meetingList"></MeetList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getMeetingList } from '@/api/expert/index';
import { uuid, getCookie } from '@/utils/index';
import MeetList from './components/meetList';
export default {
  components: {
    MeetList
  },
  data() {
    return {
      activeName: '1',
      meetingList: []
    }
  },
  watch: {
    activeName: function (newVal, oldVal) {
      this.activeName
      let val = parseInt(newVal);
      this._getMeetingList(val);
    }
  },
  created() {
    this._getMeetingList(1);
  },
  methods: {
    async _getMeetingList(type) {
      const params = {
        reqid: uuid(),
        type,
        pageindex: 1,
        pagesize: 2000
      }
      await getMeetingList(params).then(res => {
        if(res.data.status === 0) {
          this.meetingList = res.data.data.meets;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    onCreateMeeting() {
      const userInfo = JSON.parse(getCookie("userInfo"));
      if(userInfo.role !== 2) {
        this.$message.error('抱歉，您没有管理员权限，不能创建会议')
        return false;
      }
      this.$router.push('/createMeeting');
    }
  }
}
</script>

<style lang="scss" scoped>
.expertRounds {
  .createMeeting {
    margin: 10px 0;
    background: #fff;
    width: 100%;
    height: 50px;
    a {
      text-decoration: none;
    }
    p {
      line-height: 50px;
      text-align: right;
      padding-right: 30px;
      color: #4684f7;
      
    }
  }
  .listItem {
    position: relative;
    margin: 15px;
    background: #32abdf;
    padding: 15px;
    color: #fff;
    border-radius: 10px;
    div {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    p {
      display: inline-block;
      
    }
  }
}
</style>