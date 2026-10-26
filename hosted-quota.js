// Only counters live in Redis: never photographs, result URLs or API keys.
// Keep the existing ledger identity so reducing the cap never resets prior usage.
export const LEDGER_KEY='shadeset:youcam:approved-six:2026-10-26';
export const RESERVE_SCRIPT=`
local used = tonumber(redis.call('HGET', KEYS[1], 'used'))
if not used or used < 0 or used > 3 then return {-2, 0, 0} end
local visitor = tonumber(redis.call('HGET', KEYS[1], ARGV[1]) or '0')
if not visitor or visitor < 0 or visitor > 3 then return {-2, 0, 0} end
if ARGV[2] == 'reserve' then
  if used + 3 > 3 or visitor + 3 > 3 then return {0, 3-used, 3-visitor} end
  used = used + 3
  visitor = visitor + 3
  redis.call('HSET', KEYS[1], 'used', used, ARGV[1], visitor)
end
return {1, 3-used, 3-visitor}
`;
export function createQuotaStore({url,token,fetcher=fetch}){
 const endpoint=new URL(url);
 if(endpoint.protocol!=='https:'||!endpoint.hostname.endsWith('.upstash.io')||endpoint.username||endpoint.password||endpoint.port||endpoint.pathname!=='/'||endpoint.search)throw Error('Invalid storage configuration');
 return async(visitor,reserve=false)=>{
  // One EVAL is atomic across instances. Never retry an uncertain reservation.
  const response=await fetcher(endpoint.href,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',RESERVE_SCRIPT,'1',LEDGER_KEY,'visitor:'+visitor,reserve?'reserve':'status']),signal:AbortSignal.timeout(5000),redirect:'error'});
  if(!response.ok)throw Error('Storage unavailable');
  const data=await response.json(),result=data.result;
  if(data.error||!Array.isArray(result)||result.length!==3||!result.every(Number.isInteger)||![-2,0,1].includes(result[0])||result[1]<0||result[1]>3||result[2]<0||result[2]>3)throw Error('Invalid storage response');
  if(result[0]===-2)throw Error('Upload budget is not initialised');
  return {reserved:reserve&&result[0]===1,remaining:Math.min(result[1],result[2]),globalRemaining:result[1],visitorRemaining:result[2],perUpload:3};
 };
}
