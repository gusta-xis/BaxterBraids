export type Service = { id:string; name:string; category:string; price:number; duration:string; maintenance:string; image:string; description:string; care:string };
const names = ['Boxeadora sem jumbo','Knotless','Boxeadora com jumbo','Boxeadora com cachos','Nagô somente até a metade da cabeça','Nagô topo','Box Braids','Box braids com cachos','Knotless com cachos','Big knotless','Nagô masculina sem jumbo','Big knotless com cachos','Nagô masculina com jumbo','Trança rasteira sem jumbo','Trança rasteira com jumbo','Fulani braids','Trança rasteira com cachos','Fulani braids com cachos'];
const prices = [75,395,130,200,85,455,395,495,495,195,95,295,195,100,100,395,200,495];
export const services: Service[] = names.map((name,i)=>({
  id:`estilo-${i+1}`, name, category: name.includes('cachos')?'Com cachos':name.includes('Nagô')||name.includes('rasteira')?'Nagô':'Box braids', price:prices[i],
  duration:i%3===0?'2–3h':i%3===1?'4–6h':'até 1 mês e meio', maintenance:i%2?'4–6 sem.':'3–5 sem.', image:`/assets/catalog-${String(i+2).padStart(2,'0')}.jpg`,
  description:'Um visual marcante, confortável e feito com acabamento preciso para valorizar sua identidade sem abrir mão do cuidado com o couro cabeludo.',
  care:'Hidrate o couro cabeludo, proteja as tranças ao dormir e evite produtos pesados. A manutenção correta preserva o acabamento por mais tempo.'
}));
export const money=(n:number)=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
