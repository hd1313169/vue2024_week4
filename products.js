// 1. [html] 分頁模板化
// 2. [js] 建立分頁元件
// 3. [js] 取得分頁資料
// 4. [html] 新增分頁
// 5. [html] 新增編輯視窗模板
// 6. [js] 建立新增/編輯視窗元件
// 7. [html] 新增新增/編輯視窗
// 8. [html] 刪除視窗模板化
// 9. [js] 建立刪除視窗元件
// 10. [html] 新增刪除視窗

let productModal;
let delProductModal;

const app = Vue.createApp({
    //資料
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'ryanchiang13',
            products: [],

            //判斷是否為新增資料
            isNew: false,

            //存放被選取的資料
            tempProduct: {
                imagesUrl: [],
            },

            pages: {},
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
                    window.location = 'login.html';
                })
        },

        //取得資料
        getData(page = 1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    this.pages = res.data.pagination;
                })
                .catch(err => {
                    alert(err.response.data.message);
                })
        },

        //打開彈跳視窗
        openModal(isNew, item) {
            //用openModdal回傳的參數，判斷是新增/編輯/刪除

            if (isNew === 'new') {
                //回傳 new 為新增，開啟物件
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                this.$refs.productModals.openModal();

            } else if (isNew === 'edit') {
                this.tempProduct = { ...item }; //回傳 edit 為編輯，淺層拷貝資料到 tempProduct
                this.isNew = false;
                this.$refs.productModals.openModal();

            } else if (isNew === 'delete') {
                this.tempProduct = { ...item }; //回傳 delete 為刪除，拷貝資料到 tempProduct，開啟刪除視窗
                this.$refs.delModals.openModal();
            }
        },

        //更新產品
        updateProduct() {
            //有新增、刪除兩種情況使用 let，預設為新增資料
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';

            //編輯資料的情況
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put';
            }

            axios[http](url, { data: this.tempProduct })
                .then(res => {
                    alert(res.data.message); //更新提示
                    this.$refs.productModals.closeModal();
                    this.getData(); //重新渲染
                })
        },

        //刪除產品
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    this.$refs.delModals.closeModal();
                    this.getData();
                })
        },

        //新增圖片
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }

    },
    //生命週期
    mounted() {
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;

        this.checkAdmin();
    }
})

//分頁元件
app.component('pagination', {
    props: ['pages', 'getData'],
    template: '#pagination',
});

//增編視窗元件
app.component('productsModal', {
    props: ['tempProduct', 'updateProduct', 'isNew', 'createImages'],
    template: '#productsModal',
    data() {
        return {
            productModal: null,
        }
    },
    methods: {
        openModal() {
            this.productModal.show();
        },
        closeModal() {
            this.productModal.hide();
        },
    },
    mounted() {
        this.productModal = new bootstrap.Modal(document.getElementById('productModal'), { keyboard: false });

    }
})

//刪除視窗元件
app.component('delModal', {
    props: ['tempProduct', 'delProduct'],
    template: '#delModal',
    data() {
        return {
            delModal: null,
        }
    },
    methods: {
        openModal() {
            this.delModal.show();
        },
        closeModal() {
            this.delModal.hide();
        },
    },
    mounted() {
        this.delModal = new bootstrap.Modal(document.getElementById('delProductModal'), { keyboard: false });
    },
})
app.mount('#app');