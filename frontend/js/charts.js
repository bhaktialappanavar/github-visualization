// ========================================
// GitHub Visualization - D3 Charts
// ========================================


// ========================================
// Clear Chart
// ========================================

function clearChart(id) {

    d3.select(id)
        .selectAll("*")
        .remove();
}


// ========================================
// Commit Activity Chart
// ========================================

function createCommitChart(commits) {

    clearChart(
        "#commit-chart"
    );


    const activity = {};


    commits.forEach((commit) => {

        const date =
            commit.date.substring(
                0,
                10
            );


        if (!activity[date]) {

            activity[date] = 0;
        }


        activity[date]++;
    });


    const data =
        Object.entries(activity)

            .map(([date, count]) => ({

                date: new Date(date),

                count: count

            }))

            .sort(
                (a, b) =>
                    a.date - b.date
            );


    if (data.length === 0) {
        return;
    }


    const container =
        document.getElementById(
            "commit-chart"
        );


    const width =
        container.clientWidth || 500;


    const height = 270;


    const margin = {

        top: 20,

        right: 20,

        bottom: 40,

        left: 45
    };


    const svg =
        d3.select(
            "#commit-chart"
        )

        .append("svg")

        .attr(
            "width",
            "100%"
        )

        .attr(
            "height",
            height
        )

        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        );


    const x =
        d3.scaleTime()

            .domain(
                d3.extent(
                    data,
                    d => d.date
                )
            )

            .range([
                margin.left,
                width - margin.right
            ]);


    const y =
        d3.scaleLinear()

            .domain([
                0,

                d3.max(
                    data,
                    d => d.count
                ) || 1
            ])

            .nice()

            .range([
                height - margin.bottom,
                margin.top
            ]);


    // X Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(0,${height - margin.bottom})`
        )

        .call(
            d3.axisBottom(x)
                .ticks(5)
                .tickFormat(
                    d3.timeFormat(
                        "%b %d"
                    )
                )
        );


    // Y Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(${margin.left},0)`
        )

        .call(
            d3.axisLeft(y)
        );


    // Line

    const line =
        d3.line()

            .x(
                d => x(d.date)
            )

            .y(
                d => y(d.count)
            );


    svg.append("path")

        .datum(data)

        .attr(
            "fill",
            "none"
        )

        .attr(
            "stroke",
            "#8b5cf6"
        )

        .attr(
            "stroke-width",
            3
        )

        .attr(
            "d",
            line
        );


    // Data Points

    const points =
        svg.selectAll(
            ".commit-point"
        )

            .data(data)

            .enter()

            .append("circle")

            .attr(
                "class",
                "commit-point"
            )

            .attr(
                "cx",
                d => x(d.date)
            )

            .attr(
                "cy",
                d => y(d.count)
            )

            .attr(
                "r",
                5
            )

            .attr(
                "fill",
                "#8b5cf6"
            );


    // Tooltip

    points

        .on(
            "mouseenter",
            function(event, d) {

                showTooltip(
                    event,

                    `
                    <strong>
                        ${d3.timeFormat(
                            "%b %d, %Y"
                        )(d.date)}
                    </strong>

                    <br>

                    Commits: ${d.count}
                    `
                );
            }
        )

        .on(
            "mousemove",
            function(event) {

                moveTooltip(event);
            }
        )

        .on(
            "mouseleave",
            function() {

                hideTooltip();
            }
        );
}


// ========================================
// Contributor Chart
// ========================================

function createContributorChart(
    contributors
) {

    clearChart(
        "#contributor-chart"
    );


    const data =
        Object.entries(
            contributors
        )

            .map(
                ([name, count]) => ({

                    name: name,

                    count: count
                })
            )

            .sort(
                (a, b) =>
                    b.count - a.count
            )

            .slice(
                0,
                10
            );


    if (data.length === 0) {
        return;
    }


    const container =
        document.getElementById(
            "contributor-chart"
        );


    const width =
        container.clientWidth || 500;


    const height = 270;


    const margin = {

        top: 10,

        right: 20,

        bottom: 40,

        left: 100
    };


    const svg =
        d3.select(
            "#contributor-chart"
        )

        .append("svg")

        .attr(
            "width",
            "100%"
        )

        .attr(
            "height",
            height
        )

        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        );


    // X Scale

    const x =
        d3.scaleLinear()

            .domain([
                0,

                d3.max(
                    data,
                    d => d.count
                ) || 1
            ])

            .nice()

            .range([
                margin.left,
                width - margin.right
            ]);


    // Y Scale

    const y =
        d3.scaleBand()

            .domain(
                data.map(
                    d => d.name
                )
            )

            .range([
                margin.top,
                height - margin.bottom
            ])

            .padding(0.2);


    // X Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(0,${height - margin.bottom})`
        )

        .call(
            d3.axisBottom(x)
        );


    // Y Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(${margin.left},0)`
        )

        .call(
            d3.axisLeft(y)
        );


    // Bars

    const bars =
        svg.selectAll(
            ".contributor-bar"
        )

            .data(data)

            .enter()

            .append("rect")

            .attr(
                "class",
                "contributor-bar"
            )

            .attr(
                "x",
                margin.left
            )

            .attr(
                "y",
                d => y(d.name)
            )

            .attr(
                "width",
                d =>
                    x(d.count) -
                    margin.left
            )

            .attr(
                "height",
                y.bandwidth()
            )

            .attr(
                "fill",
                "#06b6d4"
            )

            .attr(
                "rx",
                5
            );


    // Tooltip

    bars

        .on(
            "mouseenter",
            function(event, d) {

                showTooltip(
                    event,

                    `
                    <strong>
                        ${d.name}
                    </strong>

                    <br>

                    Commits: ${d.count}
                    `
                );
            }
        )

        .on(
            "mousemove",
            function(event) {

                moveTooltip(event);
            }
        )

        .on(
            "mouseleave",
            function() {

                hideTooltip();
            }
        );
}


// ========================================
// Additions vs Deletions Chart
// ========================================

function createChangesChart(
    summary
) {

    clearChart(
        "#changes-chart"
    );


    const data = [

        {
            name: "Additions",

            value:
                summary.total_additions
        },

        {
            name: "Deletions",

            value:
                summary.total_deletions
        }

    ];


    const container =
        document.getElementById(
            "changes-chart"
        );


    const width =
        container.clientWidth || 500;


    const height = 270;


    const margin = {

        top: 20,

        right: 20,

        bottom: 40,

        left: 50
    };


    const svg =
        d3.select(
            "#changes-chart"
        )

        .append("svg")

        .attr(
            "width",
            "100%"
        )

        .attr(
            "height",
            height
        )

        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        );


    const x =
        d3.scaleBand()

            .domain(
                data.map(
                    d => d.name
                )
            )

            .range([
                margin.left,
                width - margin.right
            ])

            .padding(0.3);


    const y =
        d3.scaleLinear()

            .domain([
                0,

                d3.max(
                    data,
                    d => d.value
                ) || 1
            ])

            .nice()

            .range([
                height - margin.bottom,
                margin.top
            ]);


    // X Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(0,${height - margin.bottom})`
        )

        .call(
            d3.axisBottom(x)
        );


    // Y Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(${margin.left},0)`
        )

        .call(
            d3.axisLeft(y)
        );


    // Bars

    const bars =
        svg.selectAll(
            ".changes-bar"
        )

            .data(data)

            .enter()

            .append("rect")

            .attr(
                "class",
                "changes-bar"
            )

            .attr(
                "x",
                d => x(d.name)
            )

            .attr(
                "y",
                d => y(d.value)
            )

            .attr(
                "width",
                x.bandwidth()
            )

            .attr(
                "height",
                d =>
                    height -
                    margin.bottom -
                    y(d.value)
            )

            .attr(
                "fill",
                "#a78bfa"
            )

            .attr(
                "rx",
                8
            );


    // Tooltip

    bars

        .on(
            "mouseenter",
            function(event, d) {

                showTooltip(
                    event,

                    `
                    <strong>
                        ${d.name}
                    </strong>

                    <br>

                    Lines:
                    ${d.value.toLocaleString()}
                    `
                );
            }
        )

        .on(
            "mousemove",
            function(event) {

                moveTooltip(event);
            }
        )

        .on(
            "mouseleave",
            function() {

                hideTooltip();
            }
        );
}


// ========================================
// Weekday Activity Chart
// ========================================

function createWeekdayChart(
    activity
) {

    clearChart(
        "#weekday-chart"
    );


    const days = [

        "Monday",

        "Tuesday",

        "Wednesday",

        "Thursday",

        "Friday",

        "Saturday",

        "Sunday"

    ];


    const data =
        days.map(
            day => ({

                day: day,

                count:
                    activity[day] || 0
            })
        );


    const container =
        document.getElementById(
            "weekday-chart"
        );


    const width =
        container.clientWidth || 500;


    const height = 270;


    const margin = {

        top: 20,

        right: 20,

        bottom: 55,

        left: 45
    };


    const svg =
        d3.select(
            "#weekday-chart"
        )

        .append("svg")

        .attr(
            "width",
            "100%"
        )

        .attr(
            "height",
            height
        )

        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        );


    const x =
        d3.scaleBand()

            .domain(
                data.map(
                    d => d.day
                )
            )

            .range([
                margin.left,
                width - margin.right
            ])

            .padding(0.2);


    const y =
        d3.scaleLinear()

            .domain([
                0,

                d3.max(
                    data,
                    d => d.count
                ) || 1
            ])

            .nice()

            .range([
                height - margin.bottom,
                margin.top
            ]);


    // X Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(0,${height - margin.bottom})`
        )

        .call(
            d3.axisBottom(x)
                .tickFormat(
                    d =>
                        d.substring(
                            0,
                            3
                        )
                )
        );


    // Y Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(${margin.left},0)`
        )

        .call(
            d3.axisLeft(y)
        );


    // Bars

    const bars =
        svg.selectAll(
            ".weekday-bar"
        )

            .data(data)

            .enter()

            .append("rect")

            .attr(
                "class",
                "weekday-bar"
            )

            .attr(
                "x",
                d => x(d.day)
            )

            .attr(
                "y",
                d => y(d.count)
            )

            .attr(
                "width",
                x.bandwidth()
            )

            .attr(
                "height",
                d =>
                    height -
                    margin.bottom -
                    y(d.count)
            )

            .attr(
                "fill",
                "#22d3ee"
            )

            .attr(
                "rx",
                6
            );


    // Tooltip

    bars

        .on(
            "mouseenter",
            function(event, d) {

                showTooltip(
                    event,

                    `
                    <strong>
                        ${d.day}
                    </strong>

                    <br>

                    Commits: ${d.count}
                    `
                );
            }
        )

        .on(
            "mousemove",
            function(event) {

                moveTooltip(event);
            }
        )

        .on(
            "mouseleave",
            function() {

                hideTooltip();
            }
        );
}


// ========================================
// Hourly Activity Chart
// ========================================

function createHourlyChart(
    activity
) {

    clearChart(
        "#hourly-chart"
    );


    const data = [];


    for (
        let hour = 0;
        hour < 24;
        hour++
    ) {

        data.push({

            hour: hour,

            count:
                activity[hour] || 0
        });
    }


    const container =
        document.getElementById(
            "hourly-chart"
        );


    const width =
        container.clientWidth || 900;


    const height = 300;


    const margin = {

        top: 20,

        right: 20,

        bottom: 45,

        left: 45
    };


    const svg =
        d3.select(
            "#hourly-chart"
        )

        .append("svg")

        .attr(
            "width",
            "100%"
        )

        .attr(
            "height",
            height
        )

        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        );


    const x =
        d3.scaleBand()

            .domain(
                data.map(
                    d => d.hour
                )
            )

            .range([
                margin.left,
                width - margin.right
            ])

            .padding(0.15);


    const y =
        d3.scaleLinear()

            .domain([
                0,

                d3.max(
                    data,
                    d => d.count
                ) || 1
            ])

            .nice()

            .range([
                height - margin.bottom,
                margin.top
            ]);


    // X Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(0,${height - margin.bottom})`
        )

        .call(
            d3.axisBottom(x)
        );


    // Y Axis

    svg.append("g")

        .attr(
            "transform",
            `translate(${margin.left},0)`
        )

        .call(
            d3.axisLeft(y)
        );


    // Bars

    const bars =
        svg.selectAll(
            ".hourly-bar"
        )

            .data(data)

            .enter()

            .append("rect")

            .attr(
                "class",
                "hourly-bar"
            )

            .attr(
                "x",
                d => x(d.hour)
            )

            .attr(
                "y",
                d => y(d.count)
            )

            .attr(
                "width",
                x.bandwidth()
            )

            .attr(
                "height",
                d =>
                    height -
                    margin.bottom -
                    y(d.count)
            )

            .attr(
                "fill",
                "#7c3aed"
            )

            .attr(
                "rx",
                4
            );


    // Tooltip

    bars

        .on(
            "mouseenter",
            function(event, d) {

                showTooltip(
                    event,

                    `
                    <strong>
                        ${d.hour}:00
                    </strong>

                    <br>

                    Commits: ${d.count}
                    `
                );
            }
        )

        .on(
            "mousemove",
            function(event) {

                moveTooltip(event);
            }
        )

        .on(
            "mouseleave",
            function() {

                hideTooltip();
            }
        );
}