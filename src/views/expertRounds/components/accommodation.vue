<template>
  <div class="accommodation">
    <div class="expertPageTitle">
      <p>劳务费报销</p>
    </div>
    <p class="back" @click="onBack">返回</p>
    <div class="content">
      <el-form
        ref="other_fee_form"
        :model="other_fee"
        label-width="100px"
        label-position="left"
      >
        <div class="formItem" v-for="(form, formIndex) in other_fee.entry" :key="formIndex">
          <div class="subTitle">明细{{ formIndex + 1 }}</div>
          <div class="delBtn">
            <el-button
              type="primary"
              v-show="formIndex !== 0"
              @click="onDel(formIndex)"
              >删除</el-button
            >
          </div>
          <el-form-item label="费用类型">
            <el-select v-model="form.category" placeholder="请选择费用类型">
              <el-option label="住宿" value="住宿"></el-option>
              <el-option label="交通费" value="交通费"></el-option>
              <el-option label="餐费" value="餐费"></el-option>
              <el-option label="材料制作费" value="材料制作费"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额">
            <el-input v-model="form.cost" placeholder="请输入金额"></el-input>
          </el-form-item>
          <el-form-item label="劳务确认单">
            <i
              v-show="!imageList[formIndex].fa_piao_pic"
              class="el-icon-picture-outline"
            ></i>
            <img
              v-show="imageList[formIndex].fa_piao_pic"
              :src="imageList[formIndex].fa_piao_pic"
              alt=""
            />
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              @change.self="onUploadFile('fa_piao_pic', formIndex)"
            />
          </el-form-item>
          <el-form-item label="身份证正面">
            <i
              v-show="!imageList[formIndex].ming_xi_pic"
              class="el-icon-picture-outline"
            ></i>
            <img
              v-show="imageList[formIndex].ming_xi_pic"
              :src="imageList[formIndex].ming_xi_pic"
              alt=""
            />
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              @change.self="onUploadFile('ming_xi_pic', formIndex)"
            />
          </el-form-item>
        </div>
        <div class="btnGroup">
          <el-button type="primary" @click="onAdd">
            + 添加明细
          </el-button>
        </div>
        <el-form-item label="报销人姓名">
          <el-input
            v-model="other_fee.name"
            placeholder="请输入报销人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input
            v-model="other_fee.account_num"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input
            v-model="other_fee.bank_name"
            placeholder="请输入开户行"
          ></el-input>
        </el-form-item>
        <el-form-item label="总金额">
          <el-input
            v-model="other_fee.cost"
            placeholder="请输入总金额"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="btnGroup">
      <el-button type="primary" @click="onSubmit">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import {uuid} from '@/utils/index';
import { getCosToken } from "@/api/login";
export default {
  name: "Accommodation",
  data() {
    return {
      other_fee: {
        entry: [],
        name: "",
        account_num: "",
        bank_name: "",
        cost: ""
      },
      other_fee_obj: {
        category: "",
        cost: "",
        fa_piao_pic: "",
        ming_xi_pic: ""
      },
      other_fee_rules: {
        name: "请输入报销人姓名",
        account_num: "请输入账号",
        bank_name: "请输入开户行",
        cost: "请输入总金额"
      },
      other_fee_obj_rules: {
        category: "请输入费用类型",
        cost: "请输入金额",
        fa_piao_pic: "请上传发票照片",
        ming_xi_pic: "请上传身份证照片"
      },
      imageListobj: {
        fa_piao_pic: "",
        ming_xi_pic: ""
      },
      imageList: []
    };
  },
  created() {
    this.other_fee.entry.push(JSON.parse(JSON.stringify(this.other_fee_obj)));
    this.imageList.push(JSON.parse(JSON.stringify(this.imageListobj)));
  },
  methods: {
    onAdd() {
      this.other_fee.entry.push(JSON.parse(JSON.stringify(this.other_fee_obj)));
      this.imageList.push(JSON.parse(JSON.stringify(this.imageListobj)));
    },
    onDel(index) {
      this.other_fee.entry.splice(index, 1)
    },
    onSubmit() {
      let onOff = true;
      this.other_fee.entry.forEach(item => {
        for(let key in item) {
          if(!item[key]) {
            this.$message.error(this.other_fee_obj_rules[key]);
            onOff = false;
            break;
          }
        }
      })
      if(onOff) {
        for(let key in this.other_fee) {
          if(!this.other_fee[key]) {
            this.$message.error(this.other_fee_rules[key]);
            onOff = false;
            break;
          }
        }
        if(onOff) {
          this.$emit('otherFee', this.other_fee);
        }
      }
    },
    async onUploadFile(type, formIndex = 0) {
      const files = event.target.files[0];
      const reqid = uuid();
      const suffix = files.name.split('.')[1];
      const file_name = reqid + '.' + suffix;
      this.other_fee.entry[formIndex][type] = file_name;
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
    onBack() {
      this.$emit('isAccommodation', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.accommodation {
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
  .formItem {
    position: relative;
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
