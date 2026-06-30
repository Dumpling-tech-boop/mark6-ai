// 页面切换
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>{
    p.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

// 保存数据
function saveData(){
  let data = document.getElementById("input").value;
  localStorage.setItem("mk6_data", data);
  alert("数据已保存");
}

// AI生成（第2阶段会升级）
function generate(){

  let result = [];

  while(result.length < 7){
    let n = Math.floor(Math.random()*49)+1;
    if(!result.includes(n)){
      result.push(n);
    }
  }

  document.getElementById("result").innerHTML =
    "推荐号码：<br>" + result.slice(0,6).join(" - ") +
    " + " + result[6];
}
