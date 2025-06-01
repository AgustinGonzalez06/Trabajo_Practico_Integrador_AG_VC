const btnVP = document.getElementById("btnVP");
const btnSkins= document.getElementById("btnSkins");
const contenido= document.getElementById("contenido");

btnVP.addEventListener("click", () => {
    contenido.style.display = "block";
    contenido.innerHTML = `
    <h2>Tienda de Valorant Points</h2>
    <p>Aqui puedes comprar puntos para adquirir agentes, skins y mas.</p>
    <ul>
        <li>525 VP - $4.99</li>
        <li>1100 VP - $9.99</li>
        <li>2050 VP -$19.99</li>
    </ul>
    `;
});


btnSkins.addEventListener("click", () => {
    contenido.style.display = "block";
    contenido.innerHTML = `
    <h2>Tienda de Skins</h2>
    <p>aqui puedes elegir entre las mejores skins del momento!</p>
    <ul>
    <li>phantom spectrum - 2175 VP</li>
    <li>Vandal Araxys - 2175 VP</li>
    <li>Phantom ONI</li>
    <li>phantom Prime</li>
    <li>Vandal Prime</li>
    <li>Operator Aerosol</li>
    <li>Operator Nitro</li>
    <li>Glitchpop operator</li>
    <li>Sheriff Prism 2</li>
    <li>Sheriff Nebula</li>
    <li>Sheriff Neo Frontier </li>
    <li>VTC x Heretic Clasic</li>
    <li>vtc x Kru clasic</li>
    <li>Singularity butterfly cuchillo</li>
    <li>Power Fist</li>
    <li>Valorant go! vol. 1 Spectre</li>
    </ul>
    `;
});