// ========================================
// GitHub Visualization - Tooltip
// ========================================


// ========================================
// Create Tooltip
// ========================================

function createTooltip() {

    let tooltip =
        document.getElementById("tooltip");

    if (!tooltip) {

        tooltip =
            document.createElement("div");

        tooltip.id = "tooltip";

        document.body.appendChild(
            tooltip
        );
    }

    return tooltip;
}


// ========================================
// Show Tooltip
// ========================================

function showTooltip(
    event,
    content
) {

    const tooltip =
        createTooltip();

    tooltip.innerHTML =
        content;

    tooltip.style.opacity = "1";

    moveTooltip(event);
}


// ========================================
// Move Tooltip
// ========================================

function moveTooltip(event) {

    const tooltip =
        document.getElementById("tooltip");

    if (!tooltip) {
        return;
    }

    const tooltipWidth =
        tooltip.offsetWidth;

    const tooltipHeight =
        tooltip.offsetHeight;

    let left =
        event.clientX + 15;

    let top =
        event.clientY + 15;


    // Prevent tooltip from going
    // outside the right side
    if (
        left + tooltipWidth >
        window.innerWidth - 10
    ) {

        left =
            event.clientX -
            tooltipWidth -
            15;
    }


    // Prevent tooltip from going
    // outside the bottom
    if (
        top + tooltipHeight >
        window.innerHeight - 10
    ) {

        top =
            event.clientY -
            tooltipHeight -
            15;
    }


    tooltip.style.left =
        `${left}px`;

    tooltip.style.top =
        `${top}px`;
}


// ========================================
// Hide Tooltip
// ========================================

function hideTooltip() {

    const tooltip =
        document.getElementById("tooltip");

    if (!tooltip) {
        return;
    }

    tooltip.style.opacity = "0";
}