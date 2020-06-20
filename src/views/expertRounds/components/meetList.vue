<template>
  <div class="meetList">
    <p v-if="!meetingList.length" class="empty">暂无会议</p>
    <div v-else class="listItem" v-for="item in meetingList" :key="item.id" @click="onclickItem(item)">
      <div>
        <p>{{item.check_room_hospital}}</p>
        <span>{{item.city}}/{{item.area}}</span>
      </div>
      <div>
        <p>负责人：{{item.charge_man}}</p>
        <span>{{item.charge_man_phone}}</span>
      </div>
      <div>
        <p>
          <i class="el-icon-time"></i>
        {{item.check_room_data}}
        </p>
      </div>
    </div> 
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="70%">
      <span>房间密码</span>
      <el-input v-model="room_password" placeholder="请输入房间密码" autocomplete="off"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onDialogConfirm">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MeetList',
  props: {
    meetingList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      dialogVisible: false,
      room_password: '',
      curItem: ''
    }
  },
  methods: {
    onclickItem(item) {
      this.dialogVisible = true;
      this.curItem = item;
      // if(this.room_password !== item.room_password) {
      //   this.$message.error('密码输入错误');
      //   return false;
      // } else {
      //   localStorage.setItem('meetingInfo', JSON.stringify(item));
      //   this.$router.push('/meetingInfo');
      // }
    },
    onDialogConfirm() {
      if(this.room_password !== this.curItem.room_password) {
        this.$message.error('密码输入错误');
        return false;
      } else {
        localStorage.setItem('meetingInfo', JSON.stringify(this.curItem));
        this.$router.push('/meetingInfo');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.empty {
  text-align: center;
  color: #888;
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
</style>