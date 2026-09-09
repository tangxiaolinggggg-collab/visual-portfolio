const data = {
  PP: {
    label: '套图 PP', description: '产品主图与促销视觉。以清晰的商品主体、干净的色彩关系和一眼可读的卖点，建立第一印象。',
    categories: {
      '3C':['车载支架主图.jpg','苹果12尚彩手机壳主图.jpg','SE陶瓷膜主图.jpg'],
      '宠物':['加热猫窝绿灰色-主图.jpg'],
      '耗材':['图层 1321209.jpg','PP.jpg','WPS图片(5).jpeg','WPS图片(6).jpeg'],
      '户外':['卡其色 露营椅主图.jpg','蓝色冰桶-主图.jpg','绿色 露营椅主图.jpg','鲨鱼凉亭 主图.jpg','MAT11主附图.jpg'],
      '健身':['低价款闪光银划船机-PP-初稿.jpg','划船机-PP.jpg','划船机184-PP-初稿.jpg','闪光银划船机-PP-初稿.jpg','水阻划船机-PP-初稿.jpg','走步机-PP.jpg','RC-PRO懒人车-PP-初稿.jpg','sovnia-基础款动感单车-PP-初稿.jpg','YOSUDA椭圆机BE-5031-PP-初稿.jpg','YOSUDA椭圆机BE-5031-PP-初稿(1).jpg'],
      '美妆':['10寸补光灯主图.jpg','好莱坞镜子-主图.jpg','假发 主附图 P16-22.jpg','假发 主附图2#.jpg','圆柱镜-主图.jpg','USB超薄充电台镜-白色主图.jpg','WPS图片.jpeg','WPS图片1(1).jpeg'],
      '玩具':['地球仪-主图.jpg','井字棋河马主图.jpg','井字棋长颈鹿 主图.jpg','图层 13278.jpg','Hiipoo-扎染18色套装-PP.jpg','Hiipoo-Skye-24x10ml-滴胶色精染料-PP初稿aa.jpg'],
      '小家电':['804A-高速吹风机-亚马逊主图.jpg','多士炉主图.jpg','封口机主图(1).jpg','副图.png','画板-6.jpg','咖啡机 主附图.jpg','热水壶主图.jpg','图层-1321267.jpg','主图-2.jpg','EK-2305搅拌机_V4_主副图1.jpg','WPS图片(1).jpeg','WPS图片(2).jpeg','WPS图片(3).jpeg','WPS图片(4).jpeg']
    }
  },
  'A+': {
    label:'套图 A+', description:'沉浸式详情页视觉。从场景氛围、产品功能到细节质感，串联为完整的购买叙事。',
    categories:{
      '3C':['车载支架A+.jpg','苹果12尚彩手机壳A+.jpg','SE陶瓷膜A+.jpg'],
      '宠物':['加热猫窝绿灰色 A+.jpg'],
      '户外':['店铺首页.jpg','海浪A+ 手机版.jpg','户外产品宣传图.jpg','卡其色 露营椅A+.jpg','蓝色冰桶 A+.jpg','蓝色露营折叠床 A+.jpg','绿色 露营椅A+.jpg','鲨鱼凉亭A+.jpg','MAT11 A+.jpg'],
      '健身':['001C修改-A+-初稿.jpg','划船机184-A+-初稿.jpg','RC-PRO懒人车-A+-初稿.jpg'],
      '美妆':['10寸补光灯A+.jpg','好莱坞镜子-A+.jpg','圆柱镜-A+.jpg','USB超薄充电台镜-白色A+.jpg'],
      '玩具':['地球仪 A+(1).jpg','井字棋河马 A+.jpg','井字棋长颈鹿 A+.jpg','Hiipoo-扎染18色套装-A+.jpg','Hiipoo-Skye-24x10ml-滴胶色精染料-A+初稿aa.jpg'],
      '小家电':['多士炉A+.jpg','咖啡机 A+.jpg','热水壶 A+.jpg','图层-61aa0.jpg','A+ 英文版-深蓝色-pc端.jpg','A+.jpg','A+第二版.jpg']
    }
  }
};

const catalog=[
  {label:'小家电',assetCategory:'小家电',items:[
    ['高速吹风机','高速吹风机 PP.jpg'],['封口机','封口机 PP.jpg'],['咖啡机1','咖啡机1 PP.jpg','咖啡机1 A+.jpg'],['厨余垃圾处理','厨余垃圾处理 PP.jpg','厨余垃圾处理 A+.jpg'],['多士炉','多士炉 PP.jpg','多士炉 A+.jpg'],['电钻','电钻 PP.jpg','电钻 A+.jpg'],['搅拌机','搅拌机 PP.jpg'],['除湿机','除湿机 PP.jpg','除湿机 A+.jpg'],['深蓝空炸',null,'深蓝空炸 A+.jpg'],['小型咖啡机','小型咖啡机 PP.jpg'],['咖啡机2','咖啡机2 PP.jpg'],['热水壶','热水壶 PP.jpg','热水壶 A+.jpg']
  ]},
  {label:'健身器材',assetCategory:'健身',items:[
    ['划船机184','划船机184-PP.jpg','划船机184-A+.jpg'],['懒人车','懒人车 PP.jpg','懒人车-A+.jpg'],['划船机','划船机-PP.jpg'],['闪光银划船机','闪光银划船机-PP.jpg'],['走步机','走步机-PP.jpg'],['水阻划船机','水阻划船机-PP.jpg'],['黑色动感单车','黑色动感单车-PP.jpg'],['椭圆机5031','椭圆机5031 PP.jpg'],['闪光银划船机B','闪光银划船机B-PP.jpg'],['椭圆机','椭圆机 PP.jpg'],['银色健身单车',null,'银色健身单车 A+.jpg']
  ]},
  {label:'户外产品',assetCategory:'户外',items:[
    ['绿色露营椅','绿色 露营椅 PP.jpg','绿色 露营椅A+.jpg'],['露营折叠床',null,'露营折叠床 A+.jpg'],['卡其色露营椅','卡其色 露营椅 PP.jpg','卡其色 露营椅A+.jpg'],['床垫','床垫 PP.jpg','床垫 A+.jpg'],['海浪涼亭','海浪凉亭 PP.jpg','海浪凉亭A+.jpg'],['蓝色冰桶','蓝色冰桶 PP.jpg','蓝色冰桶 A+.jpg'],['鲨鱼凉亭','鲨鱼凉亭 PP.jpg'],['店铺首页',null,'店铺首页.jpg'],['户外系列产品宣传图',null,'户外系列产品宣传图.jpg']
  ]},
  {label:'美妆',assetCategory:'美妆',items:[
    ['棕色假发','棕色假发 PP.jpg'],['金色假发','金色假发 PP.jpg'],['美容仪','美容仪 PP.jpg'],['10寸补光灯','10寸补光灯 PP.jpg','10寸补光灯A+.jpg'],['牙齿美白','牙齿美白 PP.jpg'],['USB超薄充电台镜','USB超薄充电台镜 PP.jpg','USB超薄充电台镜 A+.jpg'],['圆柱镜','圆柱镜-PP.jpg','圆柱镜-A+.jpg'],['好莱坞镜子','好莱坞镜子-PP.jpg','好莱坞镜子-A+.jpg']
  ]},
  {label:'儿童玩具',assetCategory:'玩具',items:[
    ['扎染','扎染 PP.jpg','扎染 A+.jpg'],['地球仪','地球仪 PP.jpg','地球仪 A+.jpg'],['卷笔器','卷笔器 PP.jpg'],['井字棋长颈鹿','井字棋长颈鹿 PP.jpg','井字棋长颈鹿 A+.jpg'],['井字棋河马','井字棋河马 PP.jpg','井字棋河马 A+.jpg'],['滴胶染料','滴胶染料 PP.jpg','滴胶染料 A+.jpg']
  ]},
  {label:'3C数码',assetCategory:'3C',items:[
    ['SE陶瓷膜','SE陶瓷膜PP.jpg','SE陶瓷膜A+.jpg'],['剃须刀','剃须刀 PP.jpg'],['车载支架','车载支架PP.jpg','车载支架A+.jpg'],['便携剃须刀','便携剃须刀 PP.jpg'],['电动牙刷','电动牙刷 PP.jpg'],['苹果12尚彩手机壳','苹果12尚彩手机壳PP.jpg','苹果12尚彩手机壳A+.jpg']
  ]},
  {label:'宠物',assetCategory:'宠物',items:[['加热猫窝绿灰色','加热猫窝绿灰色PP.jpg','加热猫窝绿灰色 A+.jpg']]},
  {label:'打印耗材',assetCategory:'耗材',items:[
    ['打印耗材1','打印耗材1 PP.jpg'],['打印耗材2','打印耗材2 PP.jpg'],['打印耗材3','打印耗材3 PP.jpg'],['打印耗材4','打印耗材4 PP.jpg']
  ]}
];
// Vite resolves a literal `+` in a static directory correctly, but treats its
// percent-encoded form (`%2B`) as an unmatched SPA path. Keep it unescaped.
const esc = value => encodeURIComponent(value).replace(/%2B/g, '+');
const pathFor = (set, category, file) => `assets/${esc(set)}/${esc(category)}/${esc(file.replace(/\.[^.]+$/, '.webp'))}`;
const thumbPathFor = (set, category, file) => `thumbs/${esc(set)}/${esc(category)}/${esc(file.replace(/\.[^.]+$/, '.webp'))}`;
const tidyName = name => name.replace(/(主图|主附图|初稿|A\+|PP|WPS图片|图层|\([^)]*\)|\d+|[-_])/g,' ').replace(/\.[^.]+$/,'').replace(/\s+/g,' ').trim() || '产品视觉';
const gallery = document.querySelector('#gallery');
const popup = document.querySelector('#hover-preview');
const popupCard = document.querySelector('.hover-card');
const popupImage = document.querySelector('#hover-image');
let hoverTimer, closeTimer, hovered = null, popupPinned = false;

const moduleBanners={'小家电':'assets/banners/小家电.webp','健身器材':'assets/banners/健身器械.webp','户外产品':'assets/banners/户外产品.webp'};
const products=catalog.flatMap(({label,assetCategory,items})=>items.map(([name,pp,ap])=>({category:label,name,variants:{PP:pp?[{set:'PP',category:assetCategory,file:pp}]:[],'A+':ap?[{set:'A+',category:assetCategory,file:ap}]:[]}})));
// Always render the catalogue's authored order. Stored browser preferences must
// not rearrange the work windows when the site is opened on another device.
function getOrderedProducts(module){return products.filter(product=>product.category===module.label)}
function createCard(product){const primary=product.variants.PP[0]||product.variants['A+'][0];const card=document.createElement('button');card.className='thumb';const label=product.variants.PP.length&&product.variants['A+'].length?'主副图 · A+':product.variants.PP.length?'主副图':'A+';card.innerHTML=`<span class="thumb-top"><i></i>${product.category}</span><img class="thumb-image" loading="lazy" decoding="async" src="${thumbPathFor(primary.set,primary.category,primary.file)}" alt="${product.category} ${product.name}"/><span class="thumb-bottom"><span class="thumb-title">${product.name}</span><span class="thumb-count">${label}</span></span>`;const thumbnail=card.querySelector('.thumb-image');thumbnail.addEventListener('error',()=>{if(thumbnail.dataset.fallback)return;thumbnail.dataset.fallback='original';thumbnail.src=pathFor(primary.set,primary.category,primary.file)});card.onclick=()=>{clearTimeout(hoverTimer);clearTimeout(closeTimer);popupPinned=true;showPreview(product,product.variants.PP.length?'PP':'A+')};card.onpointerenter=()=>queuePreview(product);card.onpointerleave=queueClose;card.onfocus=()=>queuePreview(product);card.onblur=queueClose;return card}
const moduleOrder=['户外产品','小家电','健身器材','美妆','儿童玩具','3C数码','宠物','打印耗材'];
moduleOrder.map(label=>catalog.find(module=>module.label===label)).forEach(module=>{const moduleProducts=getOrderedProducts(module),banner=moduleBanners[module.label];const section=document.createElement('section');section.className='gallery-set';section.innerHTML=`<div class="set-head"><h1>${module.label}</h1><span>${String(moduleProducts.length).padStart(2,'0')} 组</span></div>${banner?`<figure class="module-banner"><img src="${banner}" alt="${module.label}产品展示" /></figure>`:''}<div class="thumb-grid"></div>`;const grid=section.querySelector('.thumb-grid');moduleProducts.forEach(product=>grid.append(createCard(product)));gallery.append(section)});

const dialog=document.querySelector('#viewer'), image=document.querySelector('#hero-image'), imageScroll=document.querySelector('#image-scroll'), miniMap=document.querySelector('#mini-map'), miniMapImage=document.querySelector('#mini-map-image'), miniMapViewport=document.querySelector('#mini-map-viewport');let current=[];let active=0;let context={};let mapDragging=false;
function clamp(value,min,max){return Math.min(Math.max(value,min),max)}
function syncMiniMap(){const mapRect=miniMap.getBoundingClientRect(), imageRect=miniMapImage.getBoundingClientRect(), range=imageScroll.scrollHeight-imageScroll.clientHeight;if(!imageRect.height)return;const ratio=range>0?imageScroll.clientHeight/imageScroll.scrollHeight:1;const viewportHeight=Math.max(12,imageRect.height*ratio);const top=imageRect.top-mapRect.top+(range>0?(imageScroll.scrollTop/range)*(imageRect.height-viewportHeight):0);miniMapViewport.style.left=`${imageRect.left-mapRect.left}px`;miniMapViewport.style.width=`${imageRect.width}px`;miniMapViewport.style.top=`${top}px`;miniMapViewport.style.height=`${viewportHeight}px`}
function scrollFromMap(clientY){const mapRect=miniMap.getBoundingClientRect(), imageRect=miniMapImage.getBoundingClientRect(), range=imageScroll.scrollHeight-imageScroll.clientHeight, viewportHeight=miniMapViewport.getBoundingClientRect().height;if(range<=0)return;const top=clamp(clientY-imageRect.top-viewportHeight/2,0,imageRect.height-viewportHeight);imageScroll.scrollTop=(top/(imageRect.height-viewportHeight))*range}
function render(){const file=current[active];imageScroll.scrollTop=0;image.src=pathFor(context.set,context.category,file);image.alt=context.product?.name||`${context.category} ${tidyName(file)}`;miniMapImage.src=thumbPathFor(context.set,context.category,file);image.onload=()=>{imageScroll.scrollTop=0;syncMiniMap()};miniMapImage.onload=syncMiniMap}
function setTabState(tabs,product,variant){tabs.classList.toggle('pp-active',variant==='PP');tabs.classList.toggle('ap-active',variant==='A+');tabs.classList.toggle('single',Object.values(product.variants).filter(files=>files.length).length===1);positionTabCurve(tabs,variant);tabs.querySelectorAll('button[data-variant]').forEach(button=>{const available=product.variants[button.dataset.variant].length>0;button.hidden=!available;button.disabled=!available;button.classList.toggle('active',button.dataset.variant===variant)})}
function openViewer(item,product){clearTimeout(hoverTimer);closePreview();context={set:item.set,category:item.category,product};current=[item.file];active=0;document.querySelector('#modal-kicker').textContent=`套图 / ${product.category} / ORIGINAL FILES`;document.querySelector('#modal-title').textContent=product.name;dialog.showModal();render()}
document.querySelector('.close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});document.addEventListener('keydown',e=>{if(dialog.open&&e.key==='Escape')dialog.close()});imageScroll.addEventListener('scroll',syncMiniMap,{passive:true});window.addEventListener('resize',syncMiniMap);miniMap.addEventListener('pointerdown',event=>{mapDragging=true;miniMap.setPointerCapture(event.pointerId);scrollFromMap(event.clientY);event.preventDefault()});miniMap.addEventListener('pointermove',event=>{if(mapDragging)scrollFromMap(event.clientY)});miniMap.addEventListener('pointerup',()=>{mapDragging=false});miniMap.addEventListener('pointercancel',()=>{mapDragging=false});
function positionTabCurve(tabs,variant){const shift=35/Math.max(tabs.clientWidth,1)*100,pp=tabs.querySelector('.tab-shape-pp path'),ap=tabs.querySelector('.tab-shape-ap path');if(variant==='PP'){pp.setAttribute('d',`M0 0H${45+shift}C${49+shift} 0 ${47+shift} 100 ${53+shift} 100H0Z`)}else{ap.setAttribute('d',`M100 0H${55-shift}C${51-shift} 0 ${53-shift} 100 ${47-shift} 100H100Z`)}}
function showPreview(product,variant){const item=product.variants[variant][0];if(!item)return;hovered={product,variant};popupCard.scrollTop=0;popupImage.src=pathFor(item.set,item.category,item.file);popupImage.onload=()=>{popupCard.scrollTop=0};document.querySelector('#hover-type').textContent=`套图 · ${product.category}`;document.querySelector('#hover-title').textContent=product.name;setTabState(document.querySelector('#preview-tabs'),product,variant);setTabState(document.querySelector('#bottom-preview-tabs'),product,variant);popup.classList.add('show');popup.setAttribute('aria-hidden','false')}
function queuePreview(product) { popupPinned=false;clearTimeout(closeTimer); clearTimeout(hoverTimer); const initial=product.variants.PP.length?'PP':'A+'; hoverTimer=setTimeout(()=>showPreview(product,initial),420); }
function queueClose() { clearTimeout(hoverTimer); if(!popupPinned)closeTimer = setTimeout(closePreview, 360); }
function closePreview() { popupPinned=false;popup.classList.remove('show'); popup.setAttribute('aria-hidden', 'true'); }
popup.onpointerenter = () => clearTimeout(closeTimer); popup.onpointerleave = queueClose; popup.onclick = event => { if (event.target === popup) closePreview(); };
popup.addEventListener('wheel', event => { if (!popup.classList.contains('show')) return; event.preventDefault(); popupCard.scrollBy({ top: event.deltaY, left: 0, behavior: 'auto' }); }, { passive: false });
document.querySelector('#preview-tabs').addEventListener('click',event=>{const button=event.target.closest('button[data-variant]');if(button&&!button.disabled&&hovered)showPreview(hovered.product,button.dataset.variant)});
document.querySelector('#bottom-preview-tabs').addEventListener('click',event=>{const button=event.target.closest('button[data-variant]');if(button&&!button.disabled&&hovered)showPreview(hovered.product,button.dataset.variant)});
document.querySelector('#hover-open').onclick = () => { if (hovered) openViewer(hovered.product.variants[hovered.variant][0],hovered.product); closePreview(); };
