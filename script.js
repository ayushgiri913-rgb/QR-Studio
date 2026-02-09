let qrCanvas = null;
let uploadedLogo = null;

document.addEventListener("DOMContentLoaded", function(){

const borderSlider = document.getElementById("borderSize");
const borderValue = document.getElementById("borderValue");
const loader = document.getElementById("loader");

borderValue.innerText = borderSlider.value;

borderSlider.addEventListener("input", function(){
    borderValue.innerText = this.value;
});

document.querySelectorAll(".ripple").forEach(btn=>{
    btn.addEventListener("click", function(e){
        let circle = document.createElement("span");
        circle.classList.add("ripple-effect");
    });
});

const logoInput = document.getElementById("logoUpload");
logoInput.addEventListener("change", function(e){
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function(event){
        uploadedLogo = new Image();
        uploadedLogo.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

});

function generateQR(){

const loader = document.getElementById("loader");
loader.style.display = "block";

setTimeout(()=>{

const text = document.getElementById("qrText").value.trim();
if(!text){ alert("Enter something"); loader.style.display="none"; return;}

const qrColor = document.getElementById("qrColor").value;
const bgColor = document.getElementById("bgColor").value;
const borderSize = parseInt(document.getElementById("borderSize").value);

const qrContainer = document.getElementById("qrOutput");
qrContainer.innerHTML = "";

const qrDiv = document.createElement("div");
qrContainer.appendChild(qrDiv);

new QRCode(qrDiv,{
    text:text,
    width:300,
    height:300,
    colorDark:qrColor,
    colorLight:bgColor,
    correctLevel:QRCode.CorrectLevel.H
});

const canvas = qrDiv.querySelector("canvas");
if(!canvas){ loader.style.display="none"; return;}

const finalSize = 300 + borderSize*2;
const finalCanvas = document.createElement("canvas");
finalCanvas.width = finalSize;
finalCanvas.height = finalSize;

const ctx = finalCanvas.getContext("2d");
ctx.fillStyle = bgColor;
ctx.fillRect(0,0,finalSize,finalSize);
ctx.drawImage(canvas,borderSize,borderSize);

if(uploadedLogo){
    const logoSize = finalSize*0.22;
    const x=(finalSize-logoSize)/2;
    const y=(finalSize-logoSize)/2;
    ctx.fillStyle=bgColor;
    ctx.fillRect(x-5,y-5,logoSize+10,logoSize+10);
    ctx.drawImage(uploadedLogo,x,y,logoSize,logoSize);
}

qrContainer.innerHTML="";
qrContainer.appendChild(finalCanvas);
qrCanvas = finalCanvas;

loader.style.display="none";

},500);
}

function downloadQR(type){

if(!qrCanvas){ alert("Generate QR first"); return;}

const imageType = type==="jpg"?"jpeg":type;
const dataURL = qrCanvas.toDataURL("image/"+imageType);

const link=document.createElement("a");
link.href=dataURL;
link.download="QR-Studio."+type;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
      }
