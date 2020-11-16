

/*
var courseApi = 'http://localhost:3000/courses';

fetch(courseApi)
    .then(function(response){
        return response.json();//response là object,
    })                         //response.json là promise
    .then(function(courses){
        console.log(courses);
    })
*/

/*----------------------------------- */
//Luu API
var courseApi = 'http://localhost:3000/courses';

//Khi ứng dung chay se chay start dau tien
function start(){

    /*
    getCourses(function(courses){
        renderCourses(courses);
    });
    */
    //có thể viết ngắn gọn như ở dưới
    //lấy dữ liệu(lay ra khoa hoc) và render ra view
    getCourses(renderCourses);

    handleCreateForm();
}

start();

//functions
function getCourses(callback){
    //dùng fetch goi lên API de lay nd luu tru o backend
    fetch(courseApi)    //fetch mac dinh gui di la GET nen ko can dinh nghia giao thuc
        .then(function(response){//Khi thanh cong
            return response.json();//de nhan json o .then tiep theo
        })
        .then(callback);
}

//
function createCourse(data, callback){//data: là name va description
    var options = {
        method: 'POST',//Tao moi
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // du lieu gui di
    };
    fetch(courseApi, options)
        .then(function(response){
            return response.json();//tra về: response.json(là promise)
        })                         //response là object,                 
        .then(callback);
}

function handleDeleteCourse(id){
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(courseApi + '/' + id, options)
        .then(function(response){
            response.json();
        })
        .then(function(){
            var courseItem = document.querySelector('.course-item-'+ id);
            if(courseItem){
                courseItem.remove();
            }
        });
}

//render là Tao ra view
function renderCourses(courses){
    var listCoursesBlock = document.querySelector('#list-courses');
    var htmls = courses.map(function(course){
        return `
            <li class="course-item-${course.id}">
                <h4>${course.name}</h4>
                
                <p>${course.description}</p>
                <button class="btn btn-danger" onclick="handleDeleteCourse(${course.id})">Xóa</button>
                <button class="btn btn-primary" onclick="handleEditForm(${course.id})">Sửa</button>
            </li>
        `;
    });
    listCoursesBlock.innerHTML = htmls.join('');//join() tạo ra một chuỗi mới bằng cách nối tất cả các phần tử của mảng
}

/*  edit  */
function handleEditForm(id) {
    var name = document.querySelector('.course-item-' + id + ' h4');
    var description = document.querySelector('.course-item-' + id + ' p');
    
    // console.log(name.innerHTML);
    // console.log(description.innerHTML);

    document.querySelector('input[name="name"]').value = name.innerHTML;
    document.querySelector('input[name="description"]').value = description.innerHTML;
    document.querySelector('#create').setAttribute('id', 'edit');
    document.querySelector('#edit').innerHTML = 'Save';

    var saveBtn = document.querySelector('#edit');
    saveBtn.onclick = function() {
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        var formData = {
            name: name,
            description: description
        };
        editCourse(formData, id);
    }
}

function editCourse(data, id) {
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(courseApi + '/' + id, options)
        .then(function(response) {
            response.json();
        })
        .then(function() {
            initAgain(data, id);
        })
}

function initAgain(data, id) {
    document.querySelector('input[name="name"]').value = '';
    document.querySelector('input[name="description"]').value = '';
    document.querySelector('#edit').setAttribute('id', 'create');
    document.querySelector('#create').innerHTML = 'Create';
    document.querySelector('.course-item-' + id + ' h4').innerHTML = data.name;
    document.querySelector('.course-item-' + id + ' p').innerHTML = data.description;
}
/* end edit*/

function handleCreateForm(){
    var createBtn = document.querySelector('#create');
    createBtn.onclick = function(){
        //Lấy giá trị 
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;

        var formData = {
            name: name,
            description: description    
        };

        createCourse(formData, function(){
            getCourses(renderCourses);
        });  
    }
}