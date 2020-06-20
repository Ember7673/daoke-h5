<template>
  <div class="labourReimbursement">
    <div class="expertPageTitle">
      <p>劳务费报销</p>
    </div>
    <p class="back" @click="onBack">返回</p>
    <div class="content" v-for="(form, formIndex) in lao_wu.entry" :key="formIndex">
      <div class="subTitle">劳务费{{formIndex+ 1}}</div>
      <div class="delBtn">
        <el-button type="primary" v-show="formIndex!==0" @click="onDel(formIndex)">删除</el-button>
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="类别">
          查房
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="form.cost" placeholder="请输入金额"></el-input>
        </el-form-item>
        <el-form-item label="劳务确认单">
          <i v-show="!imageList[formIndex].confirm" class="el-icon-picture-outline"></i>
          <img v-show="imageList[formIndex].confirm" :src="imageList[formIndex].confirm" alt="">
          <input type="file" accept="image/*" @change.self="onUploadFile('confirm', formIndex)">
        </el-form-item>
        <el-form-item label="身份证正面">
          <i v-show="!imageList[formIndex].id_card" class="el-icon-picture-outline"></i>
          <img v-show="imageList[formIndex].id_card" :src="imageList[formIndex].id_card" alt="">
          <input type="file" accept="image/*" @change.self="onUploadFile('id_card', formIndex)">
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.id_num" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="银行卡正面">
          <i v-show="!imageList[formIndex].bank_card" class="el-icon-picture-outline"></i>
          <img v-show="imageList[formIndex].bank_card" :src="imageList[formIndex].bank_card" alt="">
          <input type="file" accept="image/*" @change.self="onUploadFile('bank_card', formIndex)">
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="form.bank_num" placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="form.bank_name" placeholder="XX银行XX省XX市XX支行"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="btnGroup">
      <el-button type="primary" @click="onAdd">
        + 添加劳务费
      </el-button>
    </div>
    <div class="btnGroup">
      <el-button type="primary" @click="onSubmit">
        确认
      </el-button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="70%">
      <span>是否增加报销住宿/交通/餐费等</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onDialogConfirm">是</el-button>
        <el-button type="primary" @click="onDialogCancle">否，完成提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {uuid, checkIDCard} from '@/utils/index';
import { getCosToken } from "@/api/login";
export default {
  name: "LabourReimbursement",
  data() {
    return {
      dialogVisible: false,
      lao_wu_obj: {
        category: "查房",
        name: "",
        cost: "",
        confirm: "",
        id_card: "",
        id_num: "",
        bank_card: "",
        bank_num: "",
        bank_name: ""
      },
      lao_wu_obj_rules: {
        name: "请输入姓名",
        cost: "请输入金额",
        confirm: "请上传劳务单照片",
        id_card: "请上传身份证照片",
        id_num: "请输入身份证号",
        bank_card: "请上传银行卡照片",
        bank_num: "请输入银行卡号",
        bank_name: "请输入开户行"
      },
      lao_wu: {
        //如果没有劳务费，则不传此参数
        entry: []
      },
      imageListobj: {
        confirm: "",
        id_card: "",
        bank_card: ""
      },
      imageList: []
    };
  },
  created() {
    this.lao_wu.entry.push(JSON.parse(JSON.stringify(this.lao_wu_obj)));
    this.imageList.push(JSON.parse(JSON.stringify(this.imageListobj)));
  },
  methods: {
    onAdd() {
      this.lao_wu.entry.push(JSON.parse(JSON.stringify(this.lao_wu_obj)));
      this.imageList.push(JSON.parse(JSON.stringify(this.imageListobj)));
    },
    onDel(index) {
      this.lao_wu.entry.splice(index, 1)
    },
    async onUploadFile(type, formIndex) {
      const files = event.target.files[0];
      const reqid = uuid();
      const suffix = files.name.split('.')[1];
      const file_name = reqid + '.' + suffix;
      this.lao_wu.entry[formIndex][type] = file_name;
      await getCosToken({
        reqid,
        method: 1,
        file_name
      }).then(async res => {
        const {url, token} = res.data.detail;
        await this.$axios.put(url,
          files,
          {
            headers: {
              'Authorization': token,
            }
          }
        ).then(() => {
          this.$message.success('文件上传成功');
          this.$set(this.imageList[formIndex],type,url)
        }).catch(e => {
          this.$message.error(e)
        })
      })
    },
    onSubmit() {
      let onOff = true;
      this.lao_wu.entry.forEach(item => {
        for(let key in item) {
          if(!item[key]) {
            this.$message.error(this.lao_wu_obj_rules[key]);
            onOff = false;
            break;
          }
          if(key === 'id_num' && item['id_num']) {
            const idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            const isID = idcardReg.test(item['id_num']);
            if(!isID) {
              this.$message.error('身份证号码格式错误');
              onOff = false;
              break;
            }
          }
          
        }
      })
      if(onOff) {
        this.dialogVisible = true;
        this.$emit('labourReimbursement', this.lao_wu);
      }
    },
    onDialogConfirm() {
      this.dialogVisible = false;
      this.$emit('isAddAccommodation', true);
    },
    onDialogCancle() {
      this.dialogVisible = false;
      this.$emit('isAddAccommodation', false);
    },
    onBack() {
      this.$emit('isLabourReimbursement', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.labourReimbursement {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  .back {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #fff;
  }
  .content {
    position: relative;
    padding: 0 20px;
    .subTitle {
      margin: 20px 0;
      font-size: 20px;
      font-weight: 800;
      color: #666;
    }
    .el-form-item {
      position: relative;
      .el-icon-picture-outline {
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 40px;
      }
      input {
        position: absolute;
        top: 0;
        right: 10px;
        width: 40px;
        height: 40px;
        opacity: 0;
      }
      img {
        position: absolute;
        top: 0;
        right: 10px;
        width: 40px;
        height: 40px;
      }
    }
  }
  .btnGroup {
    margin: 10px auto;
    text-align: center;
  }
  .delBtn {
    position: absolute;
    top: 0;
    right: 10px;
  }
  
}
</style>
