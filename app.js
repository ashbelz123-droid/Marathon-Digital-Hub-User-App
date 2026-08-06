/*=========================================
MARATHON DIGITAL HUB APP
SPLASH SCREEN
=========================================*/

/*=========================================
SUPABASE
=========================================*/

const db = window.supabaseClient;

/*=========================================
GLOBAL VARIABLES
=========================================*/

const loadingText =
document.getElementById("loadingText");

const connectionStatus =
document.getElementById("connectionStatus");

const progressFill =
document.getElementById("progressFill");

const offlineBanner =
document.getElementById("offlineBanner");

const updateBanner =
document.getElementById("updateBanner");

let loadingProgress = 0;

/*=========================================
START APP
=========================================*/

document.addEventListener(
"DOMContentLoaded",
initializeApp
);

/*=========================================
INITIALIZE
=========================================*/

async function initializeApp(){

startLoadingAnimation();

listenNetwork();

drawNetworkBackground();

createParticles();

await checkSession();

}

/*=========================================
LOADING ANIMATION
=========================================*/

function startLoadingAnimation(){

const messages = [

"Initializing Secure Connection...",

"Connecting to Marathon Servers...",

"Loading User Interface...",

"Preparing Dashboard..."

];

let index = 0;

const timer = setInterval(()=>{

loadingProgress += 2;

if(progressFill){

progressFill.style.width =
loadingProgress + "%";

}

if(loadingText){

loadingText.textContent =
messages[index];

}

index++;

if(index >= messages.length){

index = messages.length - 1;

}

if(loadingProgress >= 100){

clearInterval(timer);

}

},80);

  }

/*=========================================
NETWORK STATUS
=========================================*/

function listenNetwork(){

window.addEventListener(
"online",
handleOnline
);

window.addEventListener(
"offline",
handleOffline
);

if(navigator.onLine){

handleOnline();

}else{

handleOffline();

}

}

/*=========================================
ONLINE
=========================================*/

function handleOnline(){

if(offlineBanner){

offlineBanner.classList.add("hidden");

}

if(connectionStatus){

connectionStatus.textContent =
"Connected to Marathon Servers";

}

showUpdateBanner(
"Internet Connected"
);

}

/*=========================================
OFFLINE
=========================================*/

function handleOffline(){

if(offlineBanner){

offlineBanner.classList.remove("hidden");

}

if(connectionStatus){

connectionStatus.textContent =
"No Internet Connection";

}

}

/*=========================================
UPDATE BANNER
=========================================*/

function showUpdateBanner(message){

if(!updateBanner) return;

const text =
document.getElementById("updateText");

if(text){

text.textContent = message;

}

updateBanner.classList.remove("hidden");

setTimeout(()=>{

updateBanner.classList.add("hidden");

},2500);

}

/*=========================================
AUTO RETRY
=========================================*/

async function retryConnection(){

if(!navigator.onLine){

return;

}

await checkSession();

                          }

/*=========================================
CHECK USER SESSION
=========================================*/

async function checkSession(){

try{

if(!db){

throw new Error("Supabase not initialized");

}

if(connectionStatus){

connectionStatus.textContent =
"Checking account...";

}

const{

data,

error

}=await db.auth.getSession();

if(error){

throw error;

}

const session =
data.session;

if(session){

if(connectionStatus){

connectionStatus.textContent =
"Welcome back...";

}

setTimeout(()=>{

window.location.replace(
"dashboard.html"
);

},800);

}else{

if(connectionStatus){

connectionStatus.textContent =
"Redirecting to Login...";

}

setTimeout(()=>{

window.location.replace(
"login.html"
);

},800);

}

}catch(err){

console.error(err);

if(connectionStatus){

connectionStatus.textContent =
"Unable to connect.";

}

showUpdateBanner(
"Connection Error"
);

setTimeout(()=>{

window.location.replace(
"login.html"
);

},2000);

}

  }

/*=========================================
ANIMATED NETWORK BACKGROUND
=========================================*/

const canvas =
document.getElementById("networkCanvas");

const ctx =
canvas.getContext("2d");

let nodes = [];

resizeCanvas();

window.addEventListener(
"resize",
resizeCanvas
);

function resizeCanvas(){

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

createNodes();

}

function createNodes(){

nodes = [];

const total =
window.innerWidth < 500 ? 28 : 45;

for(let i=0;i<total;i++){

nodes.push({

x:Math.random()*canvas.width,

y:Math.random()*canvas.height,

vx:(Math.random()-.5)*0.35,

vy:(Math.random()-.5)*0.35,

size:Math.random()*2+1

});

}

animateNetwork();

}

function animateNetwork(){

ctx.clearRect(

0,
0,

canvas.width,
canvas.height

);

/*=========================================
DRAW LINES
=========================================*/

for(let i=0;i<nodes.length;i++){

for(let j=i+1;j<nodes.length;j++){

const dx =
nodes[i].x-nodes[j].x;

const dy =
nodes[i].y-nodes[j].y;

const distance =
Math.sqrt(dx*dx+dy*dy);

if(distance<150){

ctx.beginPath();

ctx.strokeStyle =
"rgba(0,210,106,"+
(1-distance/150)*0.25+
")";

ctx.lineWidth=1;

ctx.moveTo(
nodes[i].x,
nodes[i].y
);

ctx.lineTo(
nodes[j].x,
nodes[j].y
);

ctx.stroke();

}

}

  }

/*=========================================
DRAW & MOVE NODES
=========================================*/

for(const node of nodes){

/* Draw glowing node */

ctx.beginPath();

ctx.arc(

node.x,
node.y,
node.size,

0,
Math.PI*2

);

ctx.fillStyle="#00D26A";

ctx.shadowBlur=12;

ctx.shadowColor="#00D26A";

ctx.fill();

ctx.shadowBlur=0;

/* Move */

node.x += node.vx;

node.y += node.vy;

/* Bounce */

if(

node.x <= 0 ||

node.x >= canvas.width

){

node.vx *= -1;

}

if(

node.y <= 0 ||

node.y >= canvas.height

){

node.vy *= -1;

}

}

/*=========================================
NEXT FRAME
=========================================*/

requestAnimationFrame(

animateNetwork

);

}

/*=========================================
FLOATING PARTICLES
=========================================*/

const particlesContainer =
document.getElementById("particles");

function createParticles(){

if(!particlesContainer) return;

particlesContainer.innerHTML="";

const total =
window.innerWidth < 500 ? 20 : 35;

for(let i=0;i<total;i++){

const particle =
document.createElement("span");

const size =
Math.random()*5+2;

particle.className =
"particle";

particle.style.width =
size+"px";

particle.style.height =
size+"px";

particle.style.left =
Math.random()*100+"%";

particle.style.top =
Math.random()*100+"%";

particle.style.opacity =
(Math.random()*0.5)+0.2;

particle.style.animationDuration =
(Math.random()*12+8)+"s";

particle.style.animationDelay =
(Math.random()*5)+"s";

particlesContainer.appendChild(
particle
);

}

    }

/*=========================================
PARTICLE ANIMATION
=========================================*/

function animateParticles(){

const particles =
document.querySelectorAll(".particle");

particles.forEach((particle)=>{

const x =
(Math.random()*20)-10;

const y =
(Math.random()*20)-10;

particle.animate(

[

{

transform:
"translate(0px,0px) scale(1)",

opacity:.2

},

{

transform:
`translate(${x}px,${y}px) scale(1.4)`,

opacity:.8

},

{

transform:
"translate(0px,0px) scale(1)",

opacity:.2

}

],

{

duration:
5000 + Math.random()*5000,

iterations:
Infinity,

direction:
"alternate",

easing:
"ease-in-out"

}

);

});

}

/*=========================================
START PARTICLE ANIMATION
=========================================*/

window.addEventListener(

"load",

()=>{

animateParticles();

}

/*=========================================
END OF SPLASH SCREEN
=========================================*/
);
