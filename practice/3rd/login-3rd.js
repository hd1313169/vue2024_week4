//1. 串接 vue
//2. data 格式
//3. 登入函式 login()
//4. vue 指令

const app = Vue.createApp({
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            user: {
                username: '',
                password: '',
            },
        };
    },

    methods: {
        login() {
            //1. 抓登入 api
            //2. post api、帳號、密碼到資料庫
            //3. 取得cookie
            //4. 跳轉到後台
            const api = `${this.apiUrl}/admin/signin`;
            axios.post(api, this.user)
                .then(res => {
                    const { token, expired } = res.data; //解構賦值
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
                    window.location = 'products-3rd.html';
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        }
    }
})

app.mount('#app');