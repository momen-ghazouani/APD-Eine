window.SearchLab = (function(){
  var defaults = [
    ["Articles","articles.apd-eine.com","A"],
    ["Discovery","discovery.apd-eine.com","D"],
    ["Research","research.apd-eine.com","R"],
    ["Opinion","opinion.apd-eine.com","O"],
    ["Media","media.apd-eine.com","M"],
    ["News","news.apd-eine.com","N"],
    ["Questions","questions.apd-eine.com","Q"],
    ["Studio","studio.apd-eine.com","S"],
    ["Lab","lab.apd-eine.com","L"]
  ];
  var stored = JSON.parse(localStorage.getItem("apdEineWebIdentity") || "null");
  var sites = stored || defaults.map(function(x){ return {name:x[0],domain:x[1],logo:"",letter:x[2]}; });
  var selected = 0;
  var draftLogo = "";

  function esc(v){
    return String(v).replace(/[&<>"']/g,function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c];
    });
  }

  function icon(site){
    return site.logo ? '<img src="' + esc(site.logo) + '" alt="">' : esc(site.letter || site.name.charAt(0).toUpperCase());
  }

  function save(){
    localStorage.setItem("apdEineWebIdentity",JSON.stringify(sites));
  }

  function render(query){
    query = String(query || "").trim().toLowerCase();
    var matches = sites.filter(function(site){
      return !query || (site.name + " " + site.domain).toLowerCase().indexOf(query) !== -1;
    });
    var html = '<div class="query">' + (query ? 'Results for "' + esc(query) + '"' : 'Websites · ' + matches.length) + '</div>';
    if(!matches.length){
      html += '<div class="empty">No websites found.</div>';
    } else {
      html += matches.map(function(site){
        var index = sites.indexOf(site);
        var n = esc(site.name), d = esc(site.domain), i = icon(site);
        return '<article class="result" onclick="SearchLab.selectSite(' + index + ')">' +
          '<div class="source"><div class="favicon">' + i + '</div><div class="site"><strong>' + n + '</strong>' + d + '</div></div>' +
          '<h2>' + n + ' &mdash; Official Website</h2><p>Explore ' + n + ', its ideas, projects, research and latest work.</p></article>';
      }).join("");
    }
    document.getElementById("webResults").innerHTML = html;
  }

  function updateEditor(){
    var site = sites[selected];
    document.getElementById("webSelectedSite").value = String(selected);
    document.getElementById("webNameInput").value = site.name;
    document.getElementById("webDomainInput").value = site.domain;
    document.getElementById("webUrlInput").value = site.logo && /^https?:/i.test(site.logo) ? site.logo : "";
    document.getElementById("webPreviewIcon").innerHTML = draftLogo ? '<img src="' + esc(draftLogo) + '" alt="">' : esc(site.letter || site.name.charAt(0).toUpperCase());
    document.getElementById("webPreviewName").textContent = site.name;
    document.getElementById("webFavWarning").textContent = "";
    document.getElementById("webFavWarning").className = "hint";
  }

  function preview(){
    var name = document.getElementById("webNameInput").value || "Website";
    var url = document.getElementById("webUrlInput").value.trim();
    if(url) draftLogo = url;
    document.getElementById("webPreviewName").textContent = name;
    document.getElementById("webPreviewIcon").innerHTML = draftLogo ? '<img src="' + esc(draftLogo) + '" alt="">' : esc(name.charAt(0).toUpperCase());
  }

  function selectSite(index){
    selected = index;
    draftLogo = sites[selected].logo;
    openSettingsPanel();
    updateEditor();
  }

  function changeSelected(){
    selected = parseInt(document.getElementById("webSelectedSite").value,10) || 0;
    draftLogo = sites[selected].logo;
    updateEditor();
  }

  function loadLogo(event){
    var file = event.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(){
      draftLogo = reader.result;
      document.getElementById("webUrlInput").value = "";
      validateLogo(draftLogo);
      preview();
    };
    reader.readAsDataURL(file);
  }

  function validateLogo(src){
    var box = document.getElementById("webFavWarning");
    if(!src){ box.textContent=""; box.className="hint"; return; }
    var img = new Image();
    img.onload=function(){
      var w=img.naturalWidth,h=img.naturalHeight;
      if(w!==h){ box.textContent=w+"x"+h+"px — not square."; box.className="hint warn"; }
      else if(w<48){ box.textContent=w+"x"+h+"px — below the recommended 48x48px size."; box.className="hint warn"; }
      else { box.textContent=w+"x"+h+"px — square favicon."; box.className="hint ok"; }
    };
    img.onerror=function(){ box.textContent="Could not read image dimensions."; box.className="hint warn"; };
    img.src=src;
  }

  function apply(){
    var site=sites[selected];
    site.name=document.getElementById("webNameInput").value.trim() || site.name;
    site.domain=document.getElementById("webDomainInput").value.trim() || site.domain;
    var url=document.getElementById("webUrlInput").value.trim();
    site.logo=draftLogo || url || "";
    save();
    render(document.getElementById("webSearchInput").value);
    closeSettingsPanel();
  }

  function resetSite(){
    var d=defaults[selected];
    sites[selected]={name:d[0],domain:d[1],logo:"",letter:d[2]};
    draftLogo="";
    save();
    updateEditor();
    render(document.getElementById("webSearchInput").value);
  }

  function search(value){ render(value); }

  function openSettingsPanel(){
    var select=document.getElementById("webSelectedSite");
    select.innerHTML=sites.map(function(site,i){ return '<option value="' + i + '">' + esc(site.name) + '</option>'; }).join("");
    document.getElementById("webSettingsPanel").classList.add("open");
    updateEditor();
  }

  function closeSettingsPanel(){ document.getElementById("webSettingsPanel").classList.remove("open"); }

  function back(){
    var panel=document.getElementById("webSettingsPanel");
    if(panel.classList.contains("open")){
      closeSettingsPanel();
      return;
    }
    Landing.closeOverlay('web');
  }

  function init(){
    document.getElementById("webClock").textContent=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    render("");
  }

  return {
    init:init, search:search, selectSite:selectSite, changeSelected:changeSelected,
    preview:preview, validateLogo:validateLogo, loadLogo:loadLogo, apply:apply,
    resetSite:resetSite, openSettingsPanel:openSettingsPanel, closeSettingsPanel:closeSettingsPanel, back:back
  };
})();
