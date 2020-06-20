<template>
  <div class="createMeeting">
    <div class="content">
      <div class="expertPageTitle">
        <p>创建会议</p>
      </div>
      <div class="meetingContent">
        <el-form
          ref="form"
          :rules="ruleForm"
          :model="form"
          label-width="120px"
          label-position="left"
          hide-required-asterisk
        >
          <el-form-item label="大区" prop="area">
            <el-select v-model="form.area" placeholder="请选择大区">
              <el-option label="东北" value="东北"></el-option>
              <el-option label="华北" value="华北"></el-option>
              <el-option label="华中" value="华中"></el-option>
              <el-option label="中南" value="中南"></el-option>
              <el-option label="华西" value="华西"></el-option>
              <el-option label="华南" value="华南"></el-option>
              <el-option label="华东" value="华东"></el-option>
              <el-option label="东南" value="东南"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <div class="city" @click="toAddress">{{ form.city }}</div>
          </el-form-item>
          <el-form-item label="查房日期" prop="check_room_data">
            <el-col :span="17">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.check_room_data"
                style="width: 100%;"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="查房医院" prop="check_room_hospital">
            <el-input
              v-model="form.check_room_hospital"
              placeholder="填写查房医院"
            ></el-input>
          </el-form-item>
          <el-form-item label="医院ETMS" prop="hospital_etms">
            <el-input
              v-model="form.hospital_etms"
              placeholder="查房医院ETMS编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="charge_man">
            <el-input
              v-model="form.charge_man"
              placeholder="填写会议负责志愿者"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="charge_man_phone">
            <el-input
              v-model="form.charge_man_phone"
              placeholder="填写志愿者联系电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="物料地址" prop="address">
            <el-input
              type="textarea"
              v-model="form.address"
              placeholder="填写物料详细接收地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="陪同人" prop="company_man">
            <el-input
              v-model="form.company_man"
              placeholder="填写外地专家陪同人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="company_man_phone">
            <el-input
              v-model="form.company_man_phone"
              placeholder="填写外地专家陪同人联系电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="房间密码" prop="room_password">
            <el-input
              v-model="form.room_password"
              placeholder="自定义房间六位密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动邀请函及日程(初稿)">
            <el-button>选择文件</el-button>
            <input
              class="uploadInvitation"
              type="file"
              accept=".doc,.format,.to_pdf,.pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pdf,.png,.jpg,.jpeg"
              @change="onUploadInvitation($event)"
            />
            <p>{{ form.invitation_letter_name }}</p>
            <p class="uploadInvitationTip">
              日程模板详见物料包/2.专家来查房/专家来查房邀请函（红头文件，日程可编辑）
            </p>
          </el-form-item>
          <el-form-item label="是否需要机票、火车票、包车等 大交通">
            <template>
              <el-switch
                v-model="form.ticket"
                @change="onChangeNeedTicket"
              ></el-switch>
              <div v-show="showNeedTicket">
                <el-radio-group v-model="form.need_ticket">
                  <el-radio label="1" name="need_ticket">机票/包车</el-radio>
                  <el-radio label="2" name="need_ticket">火车票</el-radio>
                </el-radio-group>
                <p
                  class="uploadInvitationTip"
                  v-show="form.need_ticket === '1'"
                >
                  请联系项目组冯鑫13810547564
                </p>
                <p
                  class="uploadInvitationTip"
                  v-show="form.need_ticket === '2'"
                >
                  请会议志愿者自行购买，会后统一报销
                </p>
              </div>
            </template>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>
              <router-link tag="p" to="/expert">取消</router-link>
            </el-button>
          </el-form-item>
        </el-form>
        <v-distpicker type="mobile" @selected="selected" v-show="addInp">
        </v-distpicker>
        <div class="mask" v-show="mask"></div>
      </div>
    </div>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import { createMeeting } from "@/api/expert/index";
import { getCosToken } from "@/api/login";
import { uuid, getCookie, getNowFormatDate } from "@/utils/index";
export default {
  components: { VDistpicker },
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      if (!Number.isInteger(+value)) {
        callback(new Error("请输入数字值"));
      } else {
        if (phoneReg.test(value)) {
          callback();
        } else {
          callback(new Error("电话号码格式不正确"));
        }
      }
    };
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("房间密码不能为空"));
      }
      if (!Number.isInteger(+value)) {
        callback(new Error("请输入数字值"));
      } else {
        if (value.length === 6) {
          callback();
        } else {
          callback(new Error("请输入六位房间密码"));
        }
      }
    };
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      form: {
        reqid: "",
        area: "",
        city: "请选择",
        check_room_data: "",
        check_room_hospital: "",
        hospital_etms: "",
        charge_man: "",
        charge_man_phone: "",
        address: "",
        company_man: "",
        company_man_phone: "",
        room_password: "",
        invitation_letter: "",
        invitation_letter_name: "",
        ticket: true,
        need_ticket: "2",
        create_man_id: "",
        create_man_phone: ""
      },
      addInp: false,
      mask: false,
      showNeedTicket: true,
      ruleForm: {
        area: [
          {
            required: true,
            message: "请选择大区",
            trigger: "blur"
          }
        ],
        city: [
          {
            required: true,
            message: "请选择城市",
            trigger: "blur"
          }
        ],
        check_room_data: [
          {
            required: true,
            message: "请选择查房日期",
            trigger: "blur"
          }
        ],
        check_room_hospital: [
          {
            required: true,
            message: "请输入查房医院",
            trigger: "blur"
          }
        ],
        hospital_etms: [
          {
            required: true,
            message: "请输入查房ETMS",
            trigger: "blur"
          }
        ],
        charge_man: [
          {
            required: true,
            message: "请输入负责人",
            trigger: "blur"
          }
        ],
        charge_man_phone: [
          {
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        room_password: [
          {
            validator: checkPassword,
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入物料地址",
            trigger: "blur"
          }
        ],
        company_man: [
          {
            required: true,
            message: "请输入陪同人",
            trigger: "blur"
          }
        ],
        invitation_letter: [
          {
            required: true,
            message: "请上传活动邀请函",
            trigger: "change"
          }
        ],
        company_man_phone: [
          {
            validator: checkPhone,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    const userInfo = JSON.parse(getCookie("userInfo"));
    this.form.create_man_id = userInfo.id;
    this.form.create_man_phone = userInfo.phone_num;
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate(async valid => {
        if(valid) {
          const {reqid,area,city,check_room_data,check_room_hospital,hospital_etms,room_password,charge_man,charge_man_phone,address,company_man,company_man_phone,invitation_letter,invitation_letter_name, need_ticket,create_man_id,create_man_phone} = this.form;
          const formData = {
            reqid: uuid(),
            area,
            city,
            check_room_data: getNowFormatDate(check_room_data),
            check_room_hospital,
            hospital_etms,
            charge_man,
            charge_man_phone,
            address,
            company_man,
            company_man_phone,
            room_password,
            invitation_letter,
            invitation_letter_name,
            need_ticket: parseInt(need_ticket),
            create_man_id,
            create_man_phone
          }
          if(!formData.invitation_letter) {
            this.$message.error('请上传活动邀请函');
            return false;
          }
          await createMeeting(formData).then(res => {
            if(res.data.status === 0) {
              this.$message.success("创建会议成功")
              this.$router.push("/expert");
            } else {
              this.$message.error(res.data.message);
            }
          })
        } else {
          return false;
        }
      })
      
    },
    onChangeNeedTicket(e) {
      if (!e) {
        this.form.need_ticket = 0;
        this.showNeedTicket = false;
      } else {
        this.showNeedTicket = true;
      }
    },
    // 点击弹出三级联动
    toAddress() {
      this.mask = true;
      this.addInp = true;
    },
    // 省市区三级联动
    selected(data) {
      this.mask = false;
      this.addInp = false;
      this.form.city = data.province.value + " " + data.city.value + " " + data.area.value;
    },
    async onUploadInvitation(event) {
      const files = event.target.files[0];
      const reqid = uuid();
      const suffix = files.name.split(".")[1];
      this.form.invitation_letter_name = files.name;
      const file_name = reqid + "." + suffix;
      this.form.invitation_letter = file_name;
      await getCosToken({
        reqid,
        method: 1,
        file_name
      }).then(async res => {
        const { url, token } = res.data.detail;
        await this.$axios.put(url,
          files,
          {
            headers: {
              'Authorization': token,
            }
          }
        ).then(() => {
          this.$message.success('文件上传成功');
        }).catch(e => {
          this.$message.error(e)
        })
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.createMeeting {
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
  .mask {
    width: 100%;
    height: 50%;
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    left: 0;
  }
  .distpicker-address-wrapper {
    height: 50%;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 99;
    background: #fff;
    overflow: hidden;
    overflow-y: scroll;
  }
  .uploadInvitation {
    position: absolute;
    top: 0;
    left: 0;
    height: 40px;
    opacity: 0;
  }
  .uploadInvitationTip {
    color: red;
    font-size: 12px;
  }
}
</style>
