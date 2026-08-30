window.AppLab = (function(){
  var apps = [
    ["Discovery","D"],["Articles","A"],["Research","R"],["Opinion","O"],
    ["Media","M"],["News","N"],["Questions","Q"],["Studio","S"],
    ["Notes","N"],["Archive","A"],["Lab","L"],["More","+"]
  ];
  var saved = JSON.parse(localStorage.getItem("appIdentityLab") || "null");
  var state = saved || Object.fromEntries(apps.map(function(pair){ return [pair[0], {name:pair[0], logo:"", letter:pair[1]}]; }));
  var selected = apps[0][0];
  var draftLogo = "";

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c];
    });
  }

  function icon(app, extra){
    extra = extra || "";
    var data = state[app[0]];
    var content = data.logo ? '<img src="' + data.logo + '" alt="">' : escapeHtml(data.letter);
    return '<div class="icon ' + extra + '">' + content + '</div>';
  }

  function render(){
    document.getElementById("appGrid").innerHTML = apps.map(function(app, i){
      var data = state[app[0]];
      return '<div class="app" onclick="AppLab.selectApp(' + i + ')">' + icon(app) + '<span>' + escapeHtml(data.name) + '</span></div>';
    }).join("");

    document.getElementById("appDock").innerHTML = apps.slice(0,4).map(function(app){ return icon(app); }).join("");
    updateEditor();
  }

  function selectApp(index){
    selected = apps[index][0];
    draftLogo = state[selected].logo;
    openSettings();
    updateEditor();
  }

  function updateEditor(){
    var data = state[selected];
    document.getElementById("appSelectedApp").value = selected;
    document.getElementById("appNameInput").value = data.name;
    document.getElementById("appUrlInput").value = data.logo && data.logo.startsWith("http") ? data.logo : "";
    document.getElementById("appPreviewName").textContent = data.name;
    document.getElementById("appPreviewIcon").innerHTML = draftLogo ? '<img src="' + draftLogo + '" alt="">' : escapeHtml(data.letter);
    document.getElementById("appApplyBtn").textContent = "Apply to " + data.name;
  }

  function changeSelected(){
    selected = document.getElementById("appSelectedApp").value;
    draftLogo = state[selected].logo;
    updateEditor();
  }

  function preview(){
    var nameValue = document.getElementById("appNameInput").value;
    document.getElementById("appPreviewName").textContent = nameValue || "App Name";
    document.getElementById("appApplyBtn").textContent = "Apply to " + (nameValue || state[selected].name);
    var url = document.getElementById("appUrlInput").value.trim();
    if(url){
      draftLogo = url;
      document.getElementById("appPreviewIcon").innerHTML = '<img src="' + url + '" alt="">';
    }
  }

  function loadLogo(event){
    var file = event.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(){
      draftLogo = reader.result;
      document.getElementById("appUrlInput").value = "";
      document.getElementById("appPreviewIcon").innerHTML = '<img src="' + draftLogo + '" alt="">';
    };
    reader.readAsDataURL(file);
  }

  function save(){
    var data = state[selected];
    data.name = document.getElementById("appNameInput").value.trim() || data.name;
    data.logo = draftLogo || document.getElementById("appUrlInput").value.trim() || "";
    localStorage.setItem("appIdentityLab", JSON.stringify(state));
    render();
    closeSettings();
  }

  function resetApp(){
    state[selected] = {name:selected, logo:"", letter:state[selected].letter};
    draftLogo = "";
    localStorage.setItem("appIdentityLab", JSON.stringify(state));
    render();
  }

  function openSettings(){
    document.getElementById("appSettings").classList.add("open");
    updateEditor();
  }

  function closeSettings(){
    document.getElementById("appSettings").classList.remove("open");
  }

  function init(){
    document.getElementById("appTime").textContent = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
    var selector = document.getElementById("appSelectedApp");
    selector.innerHTML = apps.map(function(pair){
      return '<option value="' + escapeHtml(pair[0]) + '">' + escapeHtml(pair[0]) + '</option>';
    }).join("");
    render();
  }

  return {
    init: init,
    selectApp: selectApp,
    changeSelected: changeSelected,
    preview: preview,
    loadLogo: loadLogo,
    save: save,
    resetApp: resetApp,
    openSettings: openSettings,
    closeSettings: closeSettings
  };
})();
