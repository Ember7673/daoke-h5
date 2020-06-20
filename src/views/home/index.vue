<template>
  <div class="home">
    <div class="expertPageTitle">
      会议管理系统
    </div>
    <div class="menu">
      <ul>
        <li>
          <img src="@/assets/images/home/1.jpg" alt="">
        </li>
        <li>
          <img src="@/assets/images/home/2.jpg" alt="">
        </li>
        <li class="expert">
          <router-link to="/expert">
            <img src="@/assets/images/home/3.jpg" alt="">
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.home {
  .menu {
    padding-top: 20%;
    li {
      margin: 20px auto;
      text-align: center;
      img {
        width: 250px;
      }
    }
  }
}
</style>
