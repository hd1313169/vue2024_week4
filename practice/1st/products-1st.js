let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
    //資料
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'ryanchiang13',
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
            //分頁內容
            pagination: {},
        }
    },
    //方法
    methods: {
        //檢查權限
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then(res => {
                    this.getData();
                })
                .catch(err => {
                    alert(err.response.data.message);
                    window.location = 'login-1st.html';
                })
        },
        //撈資料
        getData(page = 1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;

            axios.get(url)
                .then(res => {
                    const { products, pagination } = res.data;  //解構賦值，取出分頁內產品資料
                    this.products = products;
                    this.pagination = pagination;
                })
                .catch(err => {
                    alert(err.response.data / message);
                    window.location = 'login-1st/html';
                })
        },
        //打開彈跳視窗
        openModal(isNew, item) {
            if (isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === 'edit') {
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show();
            }
        },
    },
    mounted() {
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        this.checkAdmin();
    }
});

//分頁元件
app.component('pagination', {
    template: '#pagination',
    props: ['pages'],
    methods: {
        emitPages(item) {
            this.$emit('emit-pages', item);
        },
    },
});

//新增/編輯產品元件
app.component('productModal', {
    template: '#productModal',
    props: ['product', 'isNew'],
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'ryanchiang13',
        };
    },
    methods: {
        //更新產品
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';

            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
                http = 'put';
            }
            axios[http](url, { data: this.product })
                .then(res => {
                    alert(res.data.message);
                    this.hideModal();
                    this.$emit('update');
                })
                .catch(err => {
                    alert(err.response.data.message);
                })
        },
        createImages() {
            this.product.imagesUrl = [];
            this.product.imagesUrl.push('');
        },
        openModal() {
            productModal.show();
        },
        hideModal() {
            productModal.hide();
        },
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        });
    },
});

//刪除產品元件
app.component('delProductModal', {
    template: '#delProductModal',
    props: ['item'],
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'ryanchiang13',
        };
    },
    methods: {
        delProduct() {
            const url = `${this.apiUrl}/api/ryanchiang13/admin/product/${this.item.id}`;

            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    this.hideModal();
                    this.$emit('update');
                })
                .catch(err => {
                    alert(err.response.data.message);
                })
        },
        openModal() {
            delProductModal.show();
        },
        hideModal() {
            delProductModal.hide();
        },
    },
    mounted() {
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static',
        });
    },
});
app.mount('#app');