// V 1. [js] 串接 vue 
// V 2. [js] 建立data ->data
// V 3. [js] 取出token ->mounted
// V 4. [js] 檢查帳號權限 ->methods ->checkAdmin()
// V 5. [js] 撈資料的函式 ->methods ->getData()
// V 6. [html] 綁定表格欄位元素
// V 7. [js]定義彈出視窗類型 -> productModal、delProductModal
// V 8. [js]綁定bootstrap彈出視窗 -> mounted -> productModal、delProductModal
// V 9. [html]綁定按鈕，並調整bootstrap彈出視窗的標籤屬性
// V 10. [js]打開彈出視窗的函式  -> methods -> openModal() -> 判斷哪個按鈕觸發的對應視窗
// V 11. [js]更新產品的函式 -> methods -> updateProduct() -> 判斷是新增還是編輯
// V 12. [html]vue指令綁定表單欄位元素
// V 13. [js]刪除產品的函式 -> methods -> delProduct()
// V 14. [js]新增圖片的函式 -> methods -> createImages()
// V 15. [html]變更新增圖片功能結構

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
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
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
                productModal.show();

            } else if (isNew === 'edit') {
                this.tempProduct = { ...item }; //回傳 edit 為編輯，淺層拷貝資料到 tempProduct
                this.isNew = false;
                productModal.show();

            } else if (isNew === 'delete') {
                this.tempProduct = { ...item }; //回傳 delete 為刪除，拷貝資料到 tempProduct，開啟刪除視窗
                delProductModal.show();
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
                    productModal.hide(); //隱藏彈出視窗
                    this.getData(); //重新渲染
                })
        },

        //刪除產品
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    delProductModal.hide();
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

        //bs彈出視窗
        productModal = new bootstrap.Modal(document.getElementById('productModal'), { keyboard: false });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), { keyboard: false });
    }
})

app.mount('#app');