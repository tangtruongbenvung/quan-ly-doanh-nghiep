const KEY='quan_ly_doanh_nghiep_v1';
const seed={
 customers:[
  {code:'KH-001',name:'Thời Trang NEM - Chi nhánh Hà Nội',type:'Đại lý cấp 1',address:'Hà Nội',route:'Tuyến Hà Nội',limit:200000000,days:30,discount:5,custom:[['Kênh bán','Bán buôn Sài Gòn']],contacts:[{name:'Chị Lan',position:'Trưởng phòng Mua',phone:'0987654321',zalo:'0987654321',social:'fb.com/lan.nem',note:'Ưu tiên chốt đơn sáng'}]},
  {code:'KH-002',name:'Showroom Minh Anh',type:'Khách lẻ / Showroom',address:'Hà Nội',route:'Nội thành',limit:50000000,days:15,discount:3,custom:[],contacts:[{name:'Anh Minh',position:'Chủ cửa hàng',phone:'0900000002',zalo:'0900000002',social:'',note:''}]}
 ],
 products:[],
 orders:[
  {code:'DH-001',customer:'Thời Trang NEM - Chi nhánh Hà Nội',value:125000000,status:'Đang xử lý'},
  {code:'DH-002',customer:'Showroom Minh Anh',value:36000000,status:'Đã giao'}
 ],
 debt:0
};
let db=JSON.parse(localStorage.getItem(KEY)||'null')||seed;
function save(){localStorage.setItem(KEY,JSON.stringify(db));renderAll()}
function money(n){return Number(n||0).toLocaleString('vi-VN')+' đ'}
function showPage(id){
 document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===id));
 document.querySelectorAll('.menu-item').forEach(x=>x.classList.toggle('active',x.dataset.page===id));
 const item=document.querySelector(`.menu-item[data-page="${id}"]`);
 document.getElementById('pageTitle').textContent=item?item.innerText.trim():'Tổng quan';
 window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.menu-item').forEach(x=>x.addEventListener('click',()=>showPage(x.dataset.page)));
document.getElementById('toggleSidebar').onclick=()=>{
 const s=document.getElementById('sidebar'),m=document.querySelector('.main');
 if(innerWidth<=900)s.classList.toggle('open'); else{s.classList.toggle('collapsed');m.classList.toggle('expanded')}
};
function renderAll(){
 document.getElementById('statCustomers').textContent=db.customers.length;
 document.getElementById('statProducts').textContent=db.products.length;
 document.getElementById('statOrders').textContent=db.orders.length;
 document.getElementById('statDebt').textContent=money(db.debt||0);
 renderCustomers(); renderRecentOrders(); renderTopCustomers();
}
function renderCustomers(){
 const q=(document.getElementById('customerSearch')?.value||'').toLowerCase(),t=document.getElementById('customerTypeFilter')?.value||'';
 const rows=db.customers.map((c,i)=>({c,i})).filter(x=>(!q||(x.c.code+x.c.name).toLowerCase().includes(q))&&(!t||x.c.type===t));
 document.getElementById('customerTableBody').innerHTML=rows.length?rows.map(({c,i})=>`
 <tr><td><b>${esc(c.code)}</b></td><td><b class="text-primary">${esc(c.name)}</b><div class="text-muted">${esc(c.address||'')}</div></td>
 <td><span class="badge-soft">${esc(c.type)}</span></td><td><b>${money(c.limit)}</b><div class="text-muted">${c.days||0} ngày | CK ${c.discount||0}%</div></td>
 <td>${(c.contacts||[]).length} đầu mối</td><td class="text-end"><button class="btn btn-sm btn-outline-primary me-1" onclick="openCustomerModal(${i})"><i class="fa-solid fa-pen"></i></button><button class="btn btn-sm btn-outline-danger" onclick="deleteCustomer(${i})"><i class="fa-solid fa-trash"></i></button></td></tr>`).join(''):`<tr><td colspan="6" class="text-center text-muted py-4">Chưa có dữ liệu</td></tr>`;
}
function renderRecentOrders(){document.getElementById('recentOrders').innerHTML=db.orders.slice(0,5).map(o=>`<tr><td><b>${esc(o.code)}</b></td><td>${esc(o.customer)}</td><td>${money(o.value)}</td><td><span class="badge-soft">${esc(o.status)}</span></td></tr>`).join('')||'<tr><td colspan="4" class="text-center text-muted">Chưa có đơn hàng</td></tr>'}
function renderTopCustomers(){document.getElementById('topCustomers').innerHTML=db.customers.slice(0,5).map(c=>`<div class="customer-row"><div><b>${esc(c.name)}</b><div class="text-muted">${esc(c.type)}</div></div><span>${money(c.limit)}</span></div>`).join('')||'<div class="text-muted py-3">Chưa có khách hàng.</div>'}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
const modal=new bootstrap.Modal('#customerModal');
function openCustomerModal(i=null){
 document.getElementById('customerForm').reset();document.getElementById('customFieldsContainer').innerHTML='';document.getElementById('contactsContainer').innerHTML='';
 document.getElementById('customerIndex').value=i??'';
 document.getElementById('modalTitle').textContent=i===null?'Thêm khách hàng':'Sửa khách hàng';
 const c=i===null?null:db.customers[i];
 if(c){['code','name','type','address','route','limit','days','discount'].forEach(k=>{const el=document.getElementById('c_'+k);if(el)el.value=c[k]??''});(c.custom||[]).forEach(x=>addCustomField(x[0],x[1]));(c.contacts||[]).forEach(addContactBlock)}
 else {addCustomField('Kênh bán','');addContactBlock()}
 modal.show();
}
function addCustomField(k='',v=''){const id='cf_'+Date.now()+Math.random();document.getElementById('customFieldsContainer').insertAdjacentHTML('beforeend',`<div class="row g-2 mb-2" id="${id}"><div class="col-md-5"><input class="form-control form-control-sm cf-key" placeholder="Tên trường..." value="${esc(k)}"></div><div class="col-md-6"><input class="form-control form-control-sm cf-val" placeholder="Giá trị..." value="${esc(v)}"></div><div class="col-md-1"><button type="button" class="btn btn-sm btn-outline-danger w-100" onclick="document.getElementById('${id}').remove()">×</button></div></div>`)}
function addContactBlock(c={}){const id='cp_'+Date.now()+Math.random(),n=document.querySelectorAll('#contactsContainer .dynamic-block').length+1;document.getElementById('contactsContainer').insertAdjacentHTML('beforeend',`<div class="dynamic-block" id="${id}"><div class="contact-title d-flex justify-content-between"><span>ĐẦU MỐI LIÊN HỆ SỐ ${n}</span><button type="button" class="btn btn-sm btn-outline-danger py-0" onclick="document.getElementById('${id}').remove()">Xóa</button></div><div class="row g-2"><div class="col-md-3"><label>Họ & Tên *</label><input class="form-control form-control-sm cp-name" required value="${esc(c.name)}"></div><div class="col-md-3"><label>Vị trí / Chức năng</label><input class="form-control form-control-sm cp-position" value="${esc(c.position)}"></div><div class="col-md-2"><label>SĐT *</label><input class="form-control form-control-sm cp-phone" required value="${esc(c.phone)}"></div><div class="col-md-2"><label>Zalo</label><input class="form-control form-control-sm cp-zalo" value="${esc(c.zalo)}"></div><div class="col-md-2"><label>Facebook / Social</label><input class="form-control form-control-sm cp-social" value="${esc(c.social)}"></div><div class="col-12"><label>Ghi chú riêng</label><input class="form-control form-control-sm cp-note" value="${esc(c.note)}"></div></div></div>`)}
document.getElementById('customerForm').addEventListener('submit',e=>{
 e.preventDefault();const i=document.getElementById('customerIndex').value;
 const c={code:c_code.value.trim(),name:c_name.value.trim(),type:c_type.value,address:c_address.value,route:c_route.value,limit:+c_limit.value||0,days:+c_days.value||0,discount:+c_discount.value||0,custom:[],contacts:[]};
 document.querySelectorAll('#customFieldsContainer>div').forEach(r=>c.custom.push([r.querySelector('.cf-key').value,r.querySelector('.cf-val').value]));
 document.querySelectorAll('#contactsContainer .dynamic-block').forEach(r=>c.contacts.push({name:r.querySelector('.cp-name').value,position:r.querySelector('.cp-position').value,phone:r.querySelector('.cp-phone').value,zalo:r.querySelector('.cp-zalo').value,social:r.querySelector('.cp-social').value,note:r.querySelector('.cp-note').value}));
 if(i==='')db.customers.push(c);else db.customers[+i]=c;save();modal.hide();toast('Đã lưu khách hàng thành công');
});
function deleteCustomer(i){if(confirm('Bạn có chắc muốn xóa khách hàng này?')){db.customers.splice(i,1);save();toast('Đã xóa khách hàng')}}
function toast(msg){const el=document.createElement('div');el.className='toast-msg';el.textContent=msg;document.getElementById('toastArea').appendChild(el);setTimeout(()=>el.remove(),2500)}
renderAll();
