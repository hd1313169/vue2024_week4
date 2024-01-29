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
            const api = `${this.apiUrl}/admin/signin`;
            axios.post(api, this.user)
                .then(res => {
                    const { token, expired } = res.data;
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
                    window.location = 'products-1st.html';
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        }
    }
})

app.mount('#app');