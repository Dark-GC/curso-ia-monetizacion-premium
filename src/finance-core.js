// Hypothetical unit economics in DOP. Not income predictions or investment advice.
export function planOffer(input){
 const {price,cost,hours,hourly,target}=input;
 if(![price,cost,hourly,target].every(n=>Number.isFinite(n)&&n>=0&&n<=1e9)||!Number.isFinite(hours)||hours<=0||hours>10000)return null;
 const round=n=>Math.round(n*100)/100;
 const cash=round(price-cost),labor=round(hours*hourly),net=round(cash-labor);
 return {cash,labor,net,minimum:round(cost+labor),effective:round(cash/hours),needed:cash>0&&target>0?Math.ceil(target/cash):null,neededHours:cash>0&&target>0?round(Math.ceil(target/cash)*hours):null};
}
