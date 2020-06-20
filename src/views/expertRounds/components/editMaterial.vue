<template>
  <div class="editMaterial">
    <div class="expertPageTitle">
      <p>提交材料</p>
    </div>
    <router-link class="back" tag="p" to="/meetingInfo">返回</router-link>
    <div class="materialContent">
      <el-form
        :model="meeting_material"
        label-width="200px"
        label-position="left"
      >
        <div class="subTitle">专家查房</div>
        <el-form-item label="专家查房/坐诊时进行的照片">
          <i v-show="!imageForm.cha_fang_pic" class="el-icon-picture-outline"></i>
          <img v-show="imageForm.cha_fang_pic" :src="imageForm.cha_fang_pic" alt="">
          <input type="file" accept=".jpg,.jpeg,.png" @change.self="onUploadFile('cha_fang_pic')">
        </el-form-item>
        <el-form-item label="专家与患者的沟通、与其他医生的交流照片">
          <i v-show="!imageForm.jiao_liu_pic" class="el-icon-picture-outline"></i>
          <img v-show="imageForm.jiao_liu_pic" :src="imageForm.jiao_liu_pic" alt="">
          <input type="file" accept=".jpg,.jpeg,.png" @change.self="onUploadFile('jiao_liu_pic')">
        </el-form-item>
        <el-form-item label="专家总结交流照片">
          <i v-show="!imageForm.zong_jie_pic" class="el-icon-picture-outline"></i>
          <img v-show="imageForm.zong_jie_pic" :src="imageForm.zong_jie_pic" alt="">
          <input type="file" accept=".jpg,.jpeg,.png" @change.self="onUploadFile('zong_jie_pic')">
        </el-form-item>
        <div class="subTitle">院内培训</div>
        <el-form-item label="主席/主持人照片">
          <i v-show="!imageForm.zhu_chi_ren_pic" class="el-icon-picture-outline"></i>
          <img v-show="imageForm.zhu_chi_ren_pic" :src="imageForm.zhu_chi_ren_pic" alt="">
          <input type="file" accept=".jpg,.jpeg,.png" @change.self="onUploadFile('zhu_chi_ren_pic')">
        </el-form-item>
        <el-form-item
        v-for="(item, index) in jiangzheArray"
        label="讲者照片"
        :key="item.key">
          <i class="el-icon-picture-outline"></i>
          <img v-show="jiangzheArray[index]" :src="jiangzheArray[index]" alt="">
          <input type="file" accept=".jpg,.jpeg,.png" @change.self="onUploadFile('jiang_zhe_pic', index)">
        </el-form-item>
        <div class="btnGroup">
          <el-button type="primary" @click="onAddJiangzhe">
            + 添加讲者
          </el-button>
        </div>
        <el-form-item label="培训班全景照片（体现全部参会人员）">
          <i v-show="!imageForm.pei_xun_ban_pic" class="el-icon-picture-outline"></i>
          <img v-show="imageForm.pei_xun_ban_pic" :src="imageForm.pei_xun_ban_pic" alt="">
          <input type="file" accept=".jpg,.jpeg,.png" @change.self="onUploadFile('pei_xun_ban_pic')">
        </el-form-item>
        <el-form-item label="会场布景照片（体现会议摆放展架、桌卡等）">
          <i v-show="!imageForm.bu_zhi_pic" class="el-icon-picture-outline"></i>
          <img v-show="imageForm.bu_zhi_pic" :src="imageForm.bu_zhi_pic" alt="">
          <input type="file" accept=".jpg,.jpeg,.png" @change.self="onUploadFile('bu_zhi_pic')">
        </el-form-item>
        <div class="subTitle">签到信息</div>
        <el-form-item label="签到人数" label-width="100px">
          <el-input type="text" v-model="meeting_material.qian_dao_num"></el-input>
        </el-form-item>
        <el-form-item label="签到表">
          <i v-show="!imageForm.qian_dao_biao" class="el-icon-picture-outline"></i>
          <img v-show="imageForm.qian_dao_biao" :src="imageForm.qian_dao_biao" alt="">
          <input type="file" accept=".jpg,.jpeg,.png" @change.self="onUploadFile('qian_dao_biao')">
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input type="textarea" placeholder="签到表备注（如签到表签到人数与会议全景照片内体现人数差异大于10%，请文字说明原因）" v-model="meeting_material.qian_dao_biao_bei_zhu"></el-input>
        </el-form-item>
        
        <div class="btnGroup">
          <el-button type="primary" @click="onSubmit">
            提交材料
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {uuid} from '@/utils/index';
import { getCosToken } from "@/api/login";
export default {
  name: "EditMaterial",
  data() {
    return {
      meeting_material: {
        cha_fang_pic: "",
        jiao_liu_pic: "",
        zong_jie_pic: "",
        zhu_chi_ren_pic: "",
        jiang_zhe_pic: "", //如果有多个，英文逗号分隔
        pei_xun_ban_pic: "",
        bu_zhi_pic: "",
        qian_dao_num: "",
        qian_dao_biao: "",
        qian_dao_biao_bei_zhu: ""
      },
      rules: {
        cha_fang_pic: "请上传专家查房/坐诊时进行的照片",
        jiao_liu_pic: "请上传专家与患者的沟通、与其他医生的交流照片",
        zong_jie_pic: "请上传专家总结交流照片",
        zhu_chi_ren_pic: "请上传主席/主持人照片",
        jiang_zhe_pic: "请上传讲者照片", //如果有多个，英文逗号分隔
        pei_xun_ban_pic: "请上传培训班全景照片（体现全部参会人员",
        bu_zhi_pic: "请上传会场布景照片（体现会议摆放展架、桌卡等）",
        qian_dao_num: "请输入签到人数",
        qian_dao_biao: "请上传签到表",
        qian_dao_biao_bei_zhu: "请上传备注"
      },
      jiangzheArray: [{
        value: '',
        key: 0
      }],
      imageForm: {}
    };
  },
  created() {
  },
  methods: {
    onSubmit() {
      let onOff = true;
      for(let key in this.meeting_material) {
        if(!this.meeting_material[key]) {
          this.$message.error(this.rules[key]);
          onOff = false;
          break;
        }
      }
      if(onOff) {
        this.meeting_material.qian_dao_num = parseInt(this.meeting_material.qian_dao_num);
        this.$emit('meetingMaterial', this.meeting_material);
      }
    },
    onAddJiangzhe() {
      this.jiangzheArray.push({
        value: '',
        key: this.jiangzheArray.length
      });
    },
    async onUploadFile(type, index = 0) {
      const files = event.target.files[0];
      const reqid = uuid();
      const suffix = files.name.split('.')[1];
      const file_name = reqid + '.' + suffix;
      this.meeting_material[type] = file_name;
      if(type === 'jiang_zhe_pic' && index !==0) {
        this.meeting_material['jiang_zhe_pic'] += ',' + file_name;
      }
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
          if(type === 'jiang_zhe_pic') {
            this.$set(this.jiangzheArray,index,url)
          } else {
            this.$set(this.imageForm,type,url)
          }
        }).catch(e => {
          this.$message.error(e)
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.editMaterial {
  box-sizing: border-box;
  position: relative;
  .back {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #fff;
  }
  .subTitle {
    margin: 20px 0;
    font-size: 20px;
    font-weight: 800;
    color: #666;
  }
  .materialContent {
    padding: 0 20px;
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
}
</style>
