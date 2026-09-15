// Capture the actual Next.js pages against an isolated, deterministic demo API.
// Start a disposable copy of Novacart/frontend on 5180; see art/PROJECT-EVIDENCE.md.
import {chromium} from '@playwright/test';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const source = resolve(process.argv[2] || '../Novacart');
const output = 'art/project-evidence';
mkdirSync(output, {recursive:true});
const seed = readFileSync(resolve(source,'backend/Novacart.Core/Data/AppDbContext.cs'),'utf8');
const products = [...seed.matchAll(/new Product\s*\{([\s\S]*?)\n\s*\},/g)].slice(0,6).map(([_,body])=>{
  const string = name => JSON.parse('"'+body.match(new RegExp(name+' = "((?:[^"\\\\]|\\\\.)*)"'))[1]+'"');
  return {id:body.match(/new Guid\("([^"]+)/)[1],name:string('Name'),slug:string('Slug'),
    price:Number(body.match(/Price = ([\d.]+)/)[1]),currency:'AUD',stockQuantity:45,
    categoryName:'Seed catalogue',tags:[],imageUrl:string('ImageUrl')};
});
if(products.length!==6) throw new Error('Expected six source seed products');
const items=products.slice(0,2).map((p,i)=>({id:`demo-item-${i}`,productId:p.id,productName:p.name,productSlug:p.slug,unitPrice:p.price,price:p.price,currency:'AUD',quantity:1,lineTotal:p.price,stockQuantity:45}));
const subtotal=Number(items.reduce((sum,item)=>sum+item.lineTotal,0).toFixed(2));
const cart={id:'demo-cart',items,subtotal,totalItems:2};
const orders=[{id:'demo-order',orderNumber:'DEMO-0001',subtotal,shippingCost:0,tax:0,total:subtotal,currency:'AUD',currentStatus:'shipped',createdAt:'2026-01-15T00:00:00Z',items}];
writeFileSync(`${output}/novacart-fixture.json`,JSON.stringify({notice:'Demonstration records, not customer transactions. Product names, prices and images come from the source seed catalogue.',products,cart,orders},null,2)+'\n');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
  const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1,locale:'en-AU',colorScheme:'light',serviceWorkers:'block'});
  await context.addCookies([{name:'novacart_authed',value:'1',url:'http://localhost:5180'}]);
  await context.route('**/api/**',async route=>{
    const path=new URL(route.request().url()).pathname;
    const body=path.endsWith('/auth/me')?{id:'demo-user',email:'demo@example.invalid',fullName:'Demo visitor',roles:[]}:
      path.includes('/products')?{items:products,totalCount:6,page:1,pageSize:12,totalPages:1}:
      path==='/api/orders'?{items:orders,totalCount:1,page:1,pageSize:50,totalPages:1}:
      path.includes('/orders/')?orders[0]:path.includes('/cart')?cart:
      path.includes('/wishlist')?[]:{};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const [name,heading] of [['products','Products'],['cart','Your cart'],['orders','Order history']]) {
    await page.goto(`http://localhost:5180/en/${name}`,{timeout:120000});
    await page.getByRole('heading',{name:heading,exact:true}).waitFor();
    await page.getByText(name==='products'?products[0].name:name==='cart'?products[0].name:'DEMO-0001',{exact:false}).first().waitFor();
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
    if(errors.length) throw new Error(errors.join('\n'));
    await page.screenshot({path:`${output}/novacart-${name}.png`,animations:'disabled',clip:{x:0,y:0,width:1280,height:name==='orders'?400:name==='cart'?640:800}});
  }
} finally {await browser.close();}
