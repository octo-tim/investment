var ServerStore={
  _cache:{},_loaded:{},
  async load(key){
    if(this._loaded[key])return;
    try{
      var r=await fetch('/api/store/'+key);
      var d=await r.json();
      if(d!==null){this._cache[key]=d;localStorage.setItem(key,JSON.stringify(d));}
      else{var l=localStorage.getItem(key);if(l){this._cache[key]=JSON.parse(l);this.save(key);}}
    }catch(e){var l=localStorage.getItem(key);if(l)this._cache[key]=JSON.parse(l);}
    this._loaded[key]=true;
  },
  get(key){
    if(this._cache[key])return this._cache[key];
    try{var l=localStorage.getItem(key);if(l){this._cache[key]=JSON.parse(l);return this._cache[key];}}catch(e){}
    return {};
  },
  set(key,data){
    this._cache[key]=data;
    localStorage.setItem(key,JSON.stringify(data));
    this.save(key);
  },
  save(key){
    var data=this._cache[key]||this.get(key);
    fetch('/api/store/'+key,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(function(e){});
  }
};
(async function(){
  await ServerStore.load('inv_daily_v2');
  await ServerStore.load('inv_cf_v2');
  if(typeof renderAfterLoad==='function')renderAfterLoad();
})();
