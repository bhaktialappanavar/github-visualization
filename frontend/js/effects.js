// ========================================
// GitHub Visualization - Effects
// ========================================


// ========================================
// 3D Card Tilt Effect
// ========================================

const cards =
    document.querySelectorAll(
        ".tilt-card"
    );


cards.forEach((card) => {

    card.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            const rotateX =
                ((y - centerY) /
                    centerY) * -6;


            const rotateY =
                ((x - centerX) /
                    centerX) * 6;


            card.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateZ(10px)`;
        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
        }
    );

});