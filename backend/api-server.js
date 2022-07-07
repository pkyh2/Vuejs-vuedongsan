const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// npm i jsonwebtoken
const jwt = require('jsonwebtoken')
const e = require('express')
const app = express()
const port = 3000

const members = [
  {
    id: 3,
    name: "도서관",
    loginId: "lib",
    loginPw: "africa"
  },
  {
    id: 4,
    name: "홍길동",
    loginId: "a",
    loginPw: "1"
  },
]

app.use(bodyParser.json())
app.use(cookieParser())

app.get('/api/account', (req, res) => {

  // // 쿠키 요청이 받아들여지면
  // if (req.cookies && req.cookies.account) {
  //   const member = JSON.parse(req.cookies.account);

  //   if (member.id){
  //     return res.send(member);
  //   }
  // }
  // res.send(401);
  
  // 토큰화 검증
  if(req.cookies && req.cookies.token) {
    // 키로 검증해서 에러가 있으면 401 없으면 decoded
    jwt.verify(req.cookies.token, "abc1234567", (err, decoded) => {
      if (err) {
        return res.sendStatus(401);
      }

      return res.send(decoded);
    })
  }
  else {
    res.sendStatus(401)
  }
})

app.delete('/api/account', (req, res) => {
  if(req.cookies && req.cookies.token) {
    // 토큰 정리
    res.clearCookie("token");
  }

  res.sendStatus(200);
})

// 서버에서 post로 해당 url로 요청을 받으면
// req에서 id, pw를 대입하고, member에 저장되어 있는 id,pw와 확인
app.post('/api/account', (req, res) => {
  const loginId = req.body.loginId
  const loginPw = req.body.loginPw

  const member = members.find(m=> m.loginId === loginId && m.loginPw === loginPw);

  //  member값이 맞게 있으면 send 해준다.
  if(member) {
    const options = {
      domain: "localhost",
      path: "/",
      httpOnly: true
    }

    // jwt를 만드는데 sign이라는 메서드를 사용하고(객체, 암호화키, 만료와 같은 기타정보)
    // id값, name값 객체정보를 넣어주고,
    // 두번째 인자값으로 우리가 임의로 만드는 암호화된 키를 넣어준다.
    const token = jwt.sign({
      id: member.id,
      name: member.name,
    }, "abc1234567", {
      expiresIn: "15m",
      issuer: "africalib"
    });
    res.cookie("token", token, options)
    res.send(member);
  }
  else{
    res.send(404)
  }

  console.log(loginId, loginPw)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})