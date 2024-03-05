const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點
const path = 'ryanchiang13'; // 請加入個人 API Path

const fileInput = document.querySelector('#file');
fileInput.addEventListener('change', upload);

const imagesUrl = document.querySelector('#imageUrl')

function upload() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    // #1 撰寫上傳的 API 事件
    // console.dir(fileInput);
    const file = fileInput.files[0]

    const formData = new FormData();
    formData.append('file-to-upload', file);

    axios.post(`${url}/api/${path}/admin/upload`, formData)
        .then((res) => {
            console.log(res.data.imageUrl);
            imageUrl.innerHTML = `<img src="${res.data.imageUrl}" alt="">`;
        })
        .catch((err) => {
            alert(err.response.data.message);
            // window.location = 'login.html';
        })
}