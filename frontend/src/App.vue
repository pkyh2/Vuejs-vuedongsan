<template>
  <div class="app">
    <div v-if="state.account.id">
      <p>안녕하세요? {{state.account.name}}님!</p>
      <button @click="logout()">로그아웃</button>
    </div>
    <div v-else>
      <label for="loginId">
        <span>아이디</span>
        <input type="text" id="loginId" v-model="state.form.loginId">
      </label>
      <label for="loginPw">
        <span>패스워드</span>
        <input type="password" id="loginPw" v-model="state.form.loginPw">
      </label>
      <hr>
      <button @click="submit()">로그인</button>
    </div>  
  </div>
</template>

<script>
import axios from "axios";
import {reactive} from "vue";
export default {
  setup() {
    const state = reactive({
      account:{
        id: null,
        name: ""
      },
      form:{
        loginId: "",
        loginPw: ""
      }
    })

    axios.get("/api/account").then(res =>{
      state.account = res.data
    })

    // id, pw 입력 후 제출 버튼을 누르면
    const submit = () => {
      // args객체에 id,pw값이 선언되고 v-model로 입력한 값이 저장된다.
      const args = {
        loginId: state.form.loginId,
        loginPw: state.form.loginPw,
      };
      // post로 해당 url요청을 보내는데 인자로 args를 보낸다.
      // 성공하면 alert출력하고 data를 account에 대입한다.
      axios.post("api/account", args).then(res => {
        alert("로그인에 성공했습니다.")
        state.account = res.data
      }).catch(() => {
        alert("로그인에 실패 했습니다. 계정 정보를 확인해주세요.")
      })
    }

    const logout = () => {
      axios.delete("/api/account").then(() =>{
        alert("로그아웃 하였습니다.")
        console.log(state.account)
        state.account.id = null
        state.account.name = "";
      })
    }



    return {state, submit, logout}
    
  },
}
</script>